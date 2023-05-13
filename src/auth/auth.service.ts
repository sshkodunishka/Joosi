import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcript from 'bcrypt';
import { Users } from '@prisma/client';
import { RedisClient } from '../redis/redis.client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cacheManager: RedisClient,
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

  async registration(createUser: CreateUserDto) {
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
    const role = await this.prisma.roles.findUnique({
      where: { id: user.roleId },
    });
    const payload = { login: user.login, id: user.id, role: role.role };
    const refresh_token = uuidv4();
    await this.cacheManager.set(refresh_token, user.id, {});
    await this.cacheManager.set(user.id.toString(), refresh_token, {});
    return {
      acsess_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }
}
