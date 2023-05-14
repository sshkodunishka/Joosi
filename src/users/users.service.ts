import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Users, DanceStyles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserImamgeDto } from './dto/update-user.dto';

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

  async getAllUsers() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        roleId: true,
        login: true,
        name: true,
        lastName: true,
        photoLink: true,
        description: true,
        Roles: true,
      },
    });
  }

  async getAllUsersByRole(roleName: string): Promise<Users[] | null> {
    return await this.prisma.users.findMany({
      where: { Roles: { role: roleName } },
      include: {
        MasterClasses: {
          include: {
            Descriptions: true,
            ClassesStyles: { include: { style: true } },
          },
        },
      },
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
    delete user.password;
    return user;
  }

  async getChoreographerById(id: number): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: +id },
      include: {
        Roles: true,
        MasterClasses: {
          include: {
            Descriptions: true,
            ClassesStyles: { include: { style: true } },
          },
        },
      },
    });
    if (user.Roles.role === 'choreographer') {
      delete user.password;
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
    delete choreographer.password;
    return choreographer;
  }

  async updateProfile(userId: number, userDto: UpdateUserDto): Promise<Users> {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        name: userDto.name,
        lastName: userDto.lastName,
        description: userDto.description,
      },
      include: {
        Roles: true,
      },
    });
    delete user.password;
    return user;
  }

  async updateProfileImage(
    userId: number,
    userDto: UpdateUserImamgeDto,
  ): Promise<Users> {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        photoLink: userDto.photoLink,
      },
      include: {
        Roles: true,
      },
    });
    delete user.password;
    return user;
  }
}
