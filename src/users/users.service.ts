import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  async getAllUsers(): Promise<Users[] | null> {
    return await this.prisma.users.findMany();
  }
}
