import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}

  async createUser(data: CreateUserDto): Promise<Users> {
    const role = await this.rolesService.getRoleByValue('user');
    return this.prisma.users.create({
      data: {
        roleId: role.id,
        login: data.login,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        description: data.description,
      },
    });
  }

  async getAllUsers(): Promise<Users[] | null> {
    return await this.prisma.users.findMany();
  }

  async getUserByLogin(login: string): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: { login: login },
      include: { Roles: true },
    });
    return user;
  }

  async getUserById(id: number): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
      include: { Roles: true },
    });
    return user;
  }

  async becomeChoreographer(user: Users): Promise<Users> {
    const role = await this.rolesService.getRoleByValue('choreographer');
    const choreographer = await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        roleId: role.id,
      },
    });
    return choreographer;
  }
}
