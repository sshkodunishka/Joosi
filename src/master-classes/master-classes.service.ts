import { Injectable } from '@nestjs/common';
import { MasterClasses, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MasterClassesService {
  constructor(private prisma: PrismaService) {}

  async getAllClasses(): Promise<MasterClasses[]> {
    return this.prisma.masterClasses.findMany();
  }

  async addClass(
    masterClass: MasterClasses,
    userId: number,
  ): Promise<MasterClasses> {
    return this.prisma.masterClasses.create({
      data: {
        userId: userId,
        evenDate: masterClass.evenDate,
        place: masterClass.place,
        descriptionId: masterClass.descriptionId,
      },
    });
  }
}
