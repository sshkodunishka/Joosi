import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Requests } from '@prisma/client';
import { UsersService } from '../users/users.service';
import * as request from 'supertest';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getAllRequests() {
    return await this.prisma.requests.findMany();
  }

  async addRequest(
    userLogin: string,
    descriptionId: number,
  ): Promise<Requests> {
    const user = await this.usersService.getUserByLogin(userLogin);
    await this.prisma.descriptions.updateMany({
      where: { id: +descriptionId },
      data: {
        countOfPeople: {
          decrement: 1,
        },
      },
    });
    return this.prisma.requests.create({
      data: {
        userId: user.id,
        descriptionId: +descriptionId,
        createdDate: new Date(),
      },
    });
  }

  async deleteRequest(id: number, userLogin: string) {
    const request = await this.prisma.requests.findUnique({
      where: { id: +id },
    });
    const user = await this.usersService.getUserById(request.userId);
    if (user.login === userLogin) {
      await this.prisma.descriptions.updateMany({
        where: { id: id },
        data: {
          countOfPeople: {
            increment: 1,
          },
        },
      });
      return this.prisma.requests.delete({ where: { id: +id } });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }
}
