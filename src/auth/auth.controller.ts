import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Prisma, Users } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @Post('/refresh-token')
  getRefreshedTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.getRefreshedTokens(refreshTokenDto);
  }

  @Get('/logout')
  logout(@Req() req: any) {
    const id = req.user.id;
    return this.authService.deleteRefreshTokens(id);
  }
}
