import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Descriptions, Users } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateDescriptionDto } from './dto/create-description.dto';
@Injectable()
export class DescriptionsService {
  constructor(private prisma: PrismaService) {}

  async getAllDescriptions(): Promise<Descriptions[]> {
    const description = await this.prisma.descriptions.findMany({
      orderBy: {
        eventDate: 'desc',
      },
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

  async getAllCurrentDescriptions({
    danceStyleId,
    choreographerId,
  }: {
    danceStyleId?: number;
    choreographerId?: number;
  }): Promise<Descriptions[]> {
    const today = new Date();
    const optionalWhereSection: any = {};
    if (danceStyleId) {
      optionalWhereSection.MasterClasses = {
        ClassesStyles: {
          some: {
            styleId: +danceStyleId,
          },
        },
      };
    }

    if (choreographerId) {
      optionalWhereSection.MasterClasses = { creatorId: +choreographerId };
    }

    return await this.prisma.descriptions.findMany({
      orderBy: {
        eventDate: 'desc',
      },
      where: { ...optionalWhereSection, eventDate: { gte: today } },
      include: {
        MasterClasses: {
          include: {
            Users: {
              select: { id: true, name: true, lastName: true, photoLink: true },
            },
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

  async getUserDescriptions(userId: number, role: string) {
    let whereSection: any = {};
    if (role === 'choreographer') {
      whereSection = {
        MasterClasses: {
          creatorId: userId,
        },
      };
    } else {
      whereSection = {
        Requests: {
          some: {
            userId,
          },
        },
      };
    }
    return await this.prisma.descriptions.findMany({
      where: whereSection,
      orderBy: {
        eventDate: 'desc',
      },
      include: {
        Requests: {
          select: { userId: true },
        },
        MasterClasses: {
          include: {
            Users: {
              select: {
                id: true,
                name: true,
                lastName: true,
                photoLink: true,
              },
            },
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

  async getAllCurrentDescriptionsByChoreographer(
    creatorId: number,
  ): Promise<Descriptions[]> {
    const today = new Date();
    return await this.prisma.descriptions.findMany({
      orderBy: {
        eventDate: 'desc',
      },
      where: {
        eventDate: { gte: today },
        MasterClasses: { creatorId: +creatorId },
      },
      include: {
        MasterClasses: {
          include: {
            Users: {
              select: { id: true, name: true, lastName: true, photoLink: true },
            },
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

  async getAllCurrentDescriptionsByStyle(
    idStyle: number,
  ): Promise<Descriptions[]> {
    const today = new Date();
    return await this.prisma.descriptions.findMany({
      orderBy: {
        eventDate: 'desc',
      },
      where: {
        eventDate: { gte: today },
        MasterClasses: {
          ClassesStyles: {
            some: {
              styleId: +idStyle,
            },
          },
        },
      },
      include: {
        MasterClasses: {
          include: {
            Users: {
              select: { id: true, name: true, lastName: true, photoLink: true },
            },
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

  async getDescriptionById(id: number): Promise<Descriptions> {
    return await this.prisma.descriptions.findUnique({
      where: { id: +id },
      include: {
        MasterClasses: {
          include: {
            Users: {
              select: { id: true, name: true, lastName: true, photoLink: true },
            },
            ClassesStyles: {
              include: {
                style: true,
              },
            },
          },
        },
        Requests: true,
      },
    });
  }

  async getRequestsByDescriptionId(
    descriptionId: number,
    choreographerId: number,
  ) {
    const description = await this.prisma.descriptions.findUnique({
      where: { id: +descriptionId },
      include: {
        MasterClasses: true,
      },
    });
    if (description.MasterClasses.creatorId === choreographerId) {
      return await this.prisma.users.findMany({
        where: {
          Requests: {
            some: {
              descriptionId: +descriptionId,
            },
          },
        },
        select: {
          name: true,
          lastName: true,
          photoLink: true,
        },
      });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
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
    const masterClass = await this.prisma.masterClasses.findUnique({
      where: { id: description.classId },
    });
    if (creatorId === masterClass.creatorId) {
      return await this.prisma.descriptions.update({
        where: { id: +id },
        data: {
          eventDate: description.eventDate,
          place: description.place,
          price: description.price,
          countOfPeople: description.countOfPeople,
        },
      });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }

  async deleteDescription(id: number, creatorId: number) {
    const description = await this.prisma.descriptions.findUnique({
      where: { id: +id },
      include: {
        Requests: true,
      },
    });
    const masterClass = await this.prisma.masterClasses.findUnique({
      where: { id: description.classId },
    });
    if (creatorId === masterClass.creatorId) {
      for (const request of description.Requests) {
        await this.prisma.requests.delete({
          where: {
            id: request.id,
          },
        });
      }
      return await this.prisma.descriptions.delete({ where: { id: +id } });
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }
}
