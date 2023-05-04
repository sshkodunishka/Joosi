import { Injectable } from '@nestjs/common';
import { MasterClasses, Requests } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class MasterClassesService {
  constructor(private prisma: PrismaService) {}

  async getAllClasses(): Promise<MasterClasses[]> {
    return this.prisma.masterClasses.findMany({
      select: {
        id: true,
        title: true,
        creatorId: true,
        videoLink: true,
        imageLink: true,
        description: true,
        price: true,
        Descriptions: {
          select: {
            id: true,
            evenDate: true,
            place: true,
            countOfPeople: true,
          },
        },
        Users: {
          select: {
            roleId: true,
            name: true,
            lastName: true,
          },
        },
        ClassesStyles: {
          select: {
            style: true,
          },
        },
      },
    });
  }

  async addClass(masterClass: CreateClassDto, creatorId: number) {
    const styleIds = await this.prisma.danceStyles.findMany({
      where: {
        style: {
          in: masterClass.danceStyles,
        },
      },
      select: {
        id: true,
      },
    });

    const newClass = await this.prisma.masterClasses.create({
      data: {
        creatorId: creatorId,
        title: masterClass.title,
        videoLink: masterClass.videoLink,
        imageLink: masterClass.imageLink,
        description: masterClass.description,
        price: masterClass.price,
      },
    });

    styleIds.forEach(async (id) => {
      await this.prisma.classesStyles.create({
        data: {
          styleId: id.id,
          classId: newClass.id,
        },
      });
    });

    return newClass;
  }
}
