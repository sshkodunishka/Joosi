import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DanceStylesService } from './dance-styles.service';
import { DanceStyles, Prisma } from '@prisma/client';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('dance-styles')
export class DanceStylesController {
  constructor(private readonly danceStylesService: DanceStylesService) {}

  @Get()
  async getAllStyles(): Promise<DanceStyles[]> {
    return this.danceStylesService.getAllStyles();
  }

  @Get('/:id')
  async getStyleById(@Param('id') id: number): Promise<DanceStyles> {
    return this.danceStylesService.getStyleById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  @Post()
  async addStyle(@Body() style: Prisma.DanceStylesCreateInput) {
    return this.danceStylesService.addStyle(style);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateStyle(@Param('id') id: number, @Body() style: DanceStyles) {
    return this.danceStylesService.updateStyle(id, style);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteStyle(@Param('id') id: number) {
    return this.danceStylesService.deleteStyle(id);
  }
}
