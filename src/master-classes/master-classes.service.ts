import { Injectable } from '@nestjs/common';
import { Descriptions, MasterClasses, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class MasterClassesService {
  constructor(private prisma: PrismaService) {}

  async getAllClasses(): Promise<MasterClasses[]> {
    return this.prisma.masterClasses.findMany();
  }

  async addClass(masterClass: CreateClassDto, userId: number) {
    const newClass = await this.prisma.masterClasses.create({
      data: { userId: userId, ...masterClass },
    });

    return newClass;
  }
}
