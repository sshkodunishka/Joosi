import { Injectable } from '@nestjs/common';
import { DanceStyles, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DanceStylesService {
  constructor(private prisma: PrismaService) {}

  async getAllStyles(): Promise<DanceStyles[]> {
    return this.prisma.danceStyles.findMany();
  }

  async addStyle(style: Prisma.DanceStylesCreateInput): Promise<DanceStyles> {
    return this.prisma.danceStyles.create({ data: { ...style } });
  }
}
