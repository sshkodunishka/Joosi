import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users as UsersModel } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsers();
  }
}
