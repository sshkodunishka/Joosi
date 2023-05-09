import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MasterClassesService } from './master-classes.service';
import { MasterClasses, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { RolesGuard } from '../roles/roles.guards';
import { Roles } from '../roles/roles.decorator';
import { CreateClassDto } from './dto/create-class.dto';
import { RequestsService } from '../requests/requests.service';

@Controller('master-classes')
export class MasterClassesController {
  constructor(private readonly masterClassesService: MasterClassesService) {}

  @Get()
  async getAllClasses(): Promise<MasterClasses[]> {
    return this.masterClassesService.getAllClasses();
  }

  @Get('/:id')
  async getClassById(@Param('id') id: number): Promise<MasterClasses> {
    return this.masterClassesService.getClassById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Post()
  async addClass(@Body() masterClass: CreateClassDto, @Req() req: any) {
    return this.masterClassesService.addClass(masterClass, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(['user', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateClass(
    @Body() masterClass: CreateClassDto,
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.masterClassesService.updateClass(id, masterClass, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(['user', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteClass(@Param('id') id: number, @Req() req: any) {
    return this.masterClassesService.deleteClass(id, req.user.id);
  }
}
