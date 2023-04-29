import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DanceStyles, Descriptions, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateDescriptionDto } from './dto/create-description.dto';

@Injectable()
export class DescriptionsService {
  constructor(private prisma: PrismaService) {}

  async getAllDescriptions(): Promise<Descriptions[]> {
    return await this.prisma.descriptions.findMany();
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
}
