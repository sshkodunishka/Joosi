import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async updateClass(
    id: number,
    masterClass: CreateClassDto,
    creatorId: number,
  ) {
    const checkClass = await this.prisma.masterClasses.findUnique({
      where: { id: +id },
    });
    if (creatorId === checkClass.creatorId) {
      return await this.prisma.masterClasses.update({
        where: { id: +id },
        data: {
          title: masterClass.title,
          videoLink: masterClass.videoLink,
          imageLink: masterClass.imageLink,
          description: masterClass.description,
          price: masterClass.price,
        },
      });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }

  async deleteClass(id: number, creatorId: number) {
    const checkClass = await this.prisma.masterClasses.findUnique({
      where: { id: +id },
    });
    const descriptions = await this.prisma.descriptions.findMany({
      where: { classId: +id },
    });
    const descriptionIds = [];
    descriptions.forEach((description) => {
      descriptionIds.push(description.id);
    });
    if (creatorId === checkClass.creatorId) {
      await this.prisma.classesStyles.deleteMany({ where: { classId: +id } });
      await this.prisma.descriptions.deleteMany({ where: { classId: +id } });
      await this.prisma.requests.deleteMany({
        where: {
          descriptionId: {
            in: descriptionIds,
          },
        },
      });
      await this.prisma.masterClasses.delete({ where: { id: +id } });
      return 'Delted';
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }
}
