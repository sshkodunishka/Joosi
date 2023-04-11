// import { Injectable } from '@nestjs/common';
// import { Descriptions } from '@prisma/client';
// import { PrismaService } from 'nestjs-prisma';

// @Injectable()
// export class DescriptionsService {
//   constructor(private prisma: PrismaService) {}

//   async getAllDescriptions(): Promise<Descriptions[]> {
//     return await this.prisma.descriptions.findMany();
//   }

//   async addStyle(style: Prisma.DanceStylesCreateInput): Promise<DanceStyles> {
//     return this.prisma.danceStyles.create({ data: { ...style } });
//   }
// }
