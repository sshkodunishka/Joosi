import { Body, Controller, Get, Post } from '@nestjs/common';
import { DanceStylesService } from './dance-styles.service';
import { DanceStyles, Prisma } from '@prisma/client';

@Controller('danceStyles')
export class DanceStylesController {
  constructor(private readonly danceStylesService: DanceStylesService) {}

  @Get()
  async getAllStyles(): Promise<DanceStyles[]> {
    return this.danceStylesService.getAllStyles();
  }

  @Post('/cteateStyle')
  async addStyle(@Body() style: Prisma.DanceStylesCreateInput) {
    return this.danceStylesService.addStyle(style);
  }
}
