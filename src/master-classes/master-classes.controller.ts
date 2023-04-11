import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MasterClassesService } from './master-classes.service';
import { MasterClasses, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('masterClasses')
export class MasterClassesController {
  constructor(private readonly masterClassesService: MasterClassesService) {}

  @Get()
  async getAllClasses(): Promise<MasterClasses[]> {
    return this.masterClassesService.getAllClasses();
  }

  // @UseGuards(RolesGuard)
  // @Roles('admin', 'choreographer')
  // @UseGuards(JwtAuthGuard)
  // @Post('/createClass')
  // async addClass(@Body() masterClass: CreateClassDto, @Req() req: any) {
  //   return this.masterClassesService.addClass(masterClass, req.user.id);
  // }
}
