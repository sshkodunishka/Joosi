import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Users, DanceStyles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../roles/roles.decorator';
import * as request from 'supertest';

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

  async getAllUsersByRole(roleName: string): Promise<Users[] | null> {
    return await this.prisma.users.findMany({
      where: { Roles: { role: roleName } },
    });
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

  async getChoreographerById(id: number): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: +id },
      include: { Roles: true },
    });
    if (user.Roles.role === 'choreographer') {
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'there is no such choreographer',
      });
    }
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
