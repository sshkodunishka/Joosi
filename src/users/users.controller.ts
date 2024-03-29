import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users, Users as UsersModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';
import { UpdateUserDto, UpdateUserImamgeDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<Omit<UsersModel, 'password'>[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUser(@Req() req): Promise<UsersModel> {
    return this.usersService.getUserById(req.user.id);
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

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  async updateProfile(@Body() userDto: UpdateUserDto, @Req() req: any) {
    return this.usersService.updateProfile(req.user.id, userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile/image')
  async updateProfileImage(
    @Body() userDto: UpdateUserImamgeDto,
    @Req() req: any,
  ) {
    return this.usersService.updateProfileImage(req.user.id, userDto);
  }
}
