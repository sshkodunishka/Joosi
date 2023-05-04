import { Injectable } from '@nestjs/common';
import { DanceStyles, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DanceStylesService {
  constructor(private prisma: PrismaService) {}

  async getAllStyles(): Promise<DanceStyles[]> {
    return this.prisma.danceStyles.findMany();
  }

  async getStyleById(id: number): Promise<DanceStyles> {
    return this.prisma.danceStyles.findUnique({ where: { id: +id } });
  }

  async addStyle(style: Prisma.DanceStylesCreateInput): Promise<DanceStyles> {
    return this.prisma.danceStyles.create({ data: { ...style } });
  }

  async updateStyle(id: number, style: DanceStyles): Promise<DanceStyles> {
    return this.prisma.danceStyles.update({
      where: { id: +id },
      data: { style: style.style, description: style.description },
    });
  }

  async deleteStyle(id: number) {
    return this.prisma.danceStyles.delete({ where: { id: +id } });
  }
}
