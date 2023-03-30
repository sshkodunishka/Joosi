import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users, Users as UsersModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsers();
  }

  @Post('/becomeChoreographer')
  async becomeChoreographer(@Body() user: Users) {
    return this.usersService.becomeChoreographer(user);
  }
}
