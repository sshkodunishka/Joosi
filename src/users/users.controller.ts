import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users, Users as UsersModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@Req() req): Promise<UsersModel> {
    console.log(req.user);
    return this.usersService.getUserByLogin(req.user.login);
  }

  @Get('/choreographers')
  async getAllChareographers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsersByRole('choreographer');
  }

  @Get('/choreographers/:id')
  async getChareographerById(@Param('id') id: number): Promise<UsersModel> {
    return this.usersService.getChoreographerById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  @Post('/becomeChoreographer')
  async becomeChoreographer(@Body() user: Users) {
    return this.usersService.becomeChoreographer(user);
  }
}
