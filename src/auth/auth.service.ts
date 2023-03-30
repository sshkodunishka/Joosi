import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcript from 'bcrypt';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { use } from 'passport';
import { RedisClient } from '../redis/redis.client';
import { RolesService } from '../roles/roles.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cacheManager: RedisClient,
    private rolesService: RolesService,
    private prisma: PrismaService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return this.generateTokens(user);
  }
  private async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByLogin(loginUserDto.login);
    if (user !== null) {
      const passwordEquals = await bcript.compare(
        loginUserDto.password,
        user.password,
      );
      if (user && passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Uncorrect login or password' });
  }

  async registration(createUser: Prisma.UsersCreateInput) {
    const candidate = await this.usersService.getUserByLogin(createUser.login);
    if (candidate) {
      throw new HttpException(
        'User have already created',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcript.hash(createUser.password, 5);
    const user = await this.usersService.createUser({
      ...createUser,
      password: hashPassword,
    });
    return this.generateTokens(user);
  }

  async deleteRefreshTokens(id: number) {
    const refreshToken = await this.cacheManager.get(id.toString());
    this.cacheManager.del(id.toString());
    this.cacheManager.del(refreshToken.toString());
    return;
  }

  async getRefreshedTokens(refreshTokenDto: RefreshTokenDto) {
    const userId: number | null = await this.cacheManager.get(
      refreshTokenDto.refreshToken,
    );
    if (!userId) {
      throw new HttpException(
        'Refresh token is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.getUserById(userId);
    const tokens = await this.generateTokens(user);
    await this.cacheManager.del(refreshTokenDto.refreshToken);
    return tokens;
  }

  private async generateTokens(user: Users) {
    const payload = { login: user.login, id: user.id, roleId: user.roleId };
    const refresh_token = uuidv4();
    await this.cacheManager.set(refresh_token, user.id, {});
    await this.cacheManager.set(user.id.toString(), refresh_token, {});
    return {
      acsess_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }
}
