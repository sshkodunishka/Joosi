import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MasterClassesService } from './master-classes.service';
import { MasterClasses, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('masterClasses')
export class MasterClassesController {
  constructor(private readonly masterClassesService: MasterClassesService) {}

  @Get()
  async getAllClasses(): Promise<MasterClasses[]> {
    return this.masterClassesService.getAllClasses();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createClass')
  async addClass(@Body() masterClass: MasterClasses, @Req() req: any) {
    return this.masterClassesService.addClass(masterClass, req.user.id);
  }
}
