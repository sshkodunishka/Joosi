import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles(): Promise<Roles[]> {
    return await this.prisma.roles.findMany();
  }

  async getRoleByValue(roleName: string): Promise<Roles> {
    return await this.prisma.roles.findUnique({ where: { role: roleName } });
  }
}
