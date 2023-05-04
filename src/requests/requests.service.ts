import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RolesService } from '../roles/roles.service';
import { Requests } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getAllRequests() {
    return await this.prisma.requests.findMany();
  }
  async addRequest(userLogin: string, classId: number): Promise<Requests> {
    const user = await this.usersService.getUserByLogin(userLogin);
    return this.prisma.requests.create({
      data: { userId: user.id, classId: +classId, createdDate: new Date() },
    });
  }
}
