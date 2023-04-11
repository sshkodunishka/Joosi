import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DanceStylesService } from './dance-styles.service';
import { DanceStyles, Prisma } from '@prisma/client';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('danceStyles')
export class DanceStylesController {
  constructor(private readonly danceStylesService: DanceStylesService) {}

  @Get()
  async getAllStyles(): Promise<DanceStyles[]> {
    return this.danceStylesService.getAllStyles();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Post('/cteateStyle')
  async addStyle(@Body() style: Prisma.DanceStylesCreateInput) {
    return this.danceStylesService.addStyle(style);
  }
}
