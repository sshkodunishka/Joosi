import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DanceStyles, Descriptions, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateDescriptionDto } from './dto/create-description.dto';

@Injectable()
export class DescriptionsService {
  constructor(private prisma: PrismaService) {}

  async getAllDescriptions(): Promise<Descriptions[]> {
    const description = await this.prisma.descriptions.findMany({
      include: {
        MasterClasses: {
          include: {
            Users: { select: { name: true, lastName: true, photoLink: true } },
            ClassesStyles: {
              include: {
                style: true,
              },
            },
          },
        },
      },
    });

    return description;
  }

  async getAllCurrentDescriptions(): Promise<Descriptions[]> {
    const today = new Date();
    return await this.prisma.descriptions.findMany({
      where: { evenDate: { gte: today } },
      include: {
        MasterClasses: {
          include: {
            Users: { select: { name: true, lastName: true, photoLink: true } },
            ClassesStyles: {
              include: {
                style: true,
              },
            },
          },
        },
      },
    });
  }

  async addDescription(
    description: CreateDescriptionDto,
    creatorId: number,
  ): Promise<Descriptions> {
    const masterClass = await this.prisma.masterClasses.findUnique({
      where: { id: description.classId },
    });

    if (creatorId === masterClass.creatorId) {
      return this.prisma.descriptions.create({ data: { ...description } });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }

  async updateDescription(
    id: number,
    creatorId: number,
    description: CreateDescriptionDto,
  ) {
    console.log(creatorId);
    const masterClass = await this.prisma.masterClasses.findUnique({
      where: { id: description.classId },
    });
    console.log(masterClass.creatorId);
    if (creatorId === masterClass.creatorId) {
      return await this.prisma.descriptions.update({
        where: { id: +id },
        data: {
          ...description,
        },
      });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }

  async deleteDescription(id: number, creatorId: number) {
    const description = await this.prisma.descriptions.findUnique({
      where: { id: +id },
    });
    const masterClass = await this.prisma.masterClasses.findUnique({
      where: { id: description.classId },
    });
    if (creatorId === masterClass.creatorId) {
      return await this.prisma.descriptions.delete({ where: { id: +id } });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }
}
