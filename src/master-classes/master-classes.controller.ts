import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  constructor(
    private readonly masterClassesService: MasterClassesService,
    private readonly requestsService: RequestsService,
  ) {}

  @Get()
  async getAllClasses(): Promise<MasterClasses[]> {
    return this.masterClassesService.getAllClasses();
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
  @Post('/:id/:requests')
  async addRequest(@Param('id') id: number, @Req() req: any) {
    return this.requestsService.addRequest(req.user.login, id);
  }
}
