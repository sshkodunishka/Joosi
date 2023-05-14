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
        Descriptions: {
          select: {
            id: true,
            eventDate: true,
            place: true,
            countOfPeople: true,
            price: true,
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

  async getClassById(id: number): Promise<MasterClasses> {
    return await this.prisma.masterClasses.findUnique({
      where: { id: +id },
      select: {
        id: true,
        title: true,
        creatorId: true,
        videoLink: true,
        imageLink: true,
        description: true,
        Descriptions: {
          select: {
            id: true,
            eventDate: true,
            place: true,
            countOfPeople: true,
            price: true,
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
    const newClass = await this.prisma.masterClasses.create({
      data: {
        creatorId: creatorId,
        title: masterClass.title,
        videoLink: masterClass.videoLink,
        imageLink: masterClass.imageLink,
        description: masterClass.description,
      },
    });

    masterClass.danceStylesId.forEach(async (id) => {
      await this.prisma.classesStyles.create({
        data: {
          styleId: id,
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
      await this.prisma.masterClasses.update({
        where: { id: +id },
        data: {
          title: masterClass.title,
          videoLink: masterClass.videoLink,
          imageLink: masterClass.imageLink,
          description: masterClass.description,
        },
      });
      const classStyles = await this.prisma.classesStyles.findMany({
        where: {
          classId: +id,
        },
      });
      for (const classStyle of classStyles) {
        await this.prisma.classesStyles.delete({
          where: {
            classId_styleId: {
              classId: classStyle.classId,
              styleId: classStyle.styleId,
            },
          },
        });
      }
      for (const danceStyleId of masterClass.danceStylesId) {
        await this.prisma.classesStyles.create({
          data: {
            styleId: danceStyleId,
            classId: checkClass.id,
          },
        });
      }
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
