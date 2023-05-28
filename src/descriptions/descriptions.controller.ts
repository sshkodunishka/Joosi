import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DescriptionsService } from './descriptions.service';
import { Descriptions, Users } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guards';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { RequestsService } from '../requests/requests.service';

@Controller('descriptions')
export class DescriptionsController {
  constructor(
    private readonly descriptionsService: DescriptionsService,
    private readonly requestsService: RequestsService,
  ) {}

  @Get()
  async getAllDescriptions(
    @Query('danceStyleId') danceStyleId: number,
    @Query('choreographerId') choreographerId: number,
  ): Promise<Descriptions[]> {
    return this.descriptionsService.getAllCurrentDescriptions({
      danceStyleId,
      choreographerId,
    });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserDescriptions(@Req() req: any): Promise<Descriptions[]> {
    return this.descriptionsService.getUserDescriptions(req.user.id, 'user');
  }

  @Get('choreographer')
  @Roles(['choreographer'])
  @UseGuards(JwtAuthGuard)
  async getCreatedDescriptions(@Req() req: any): Promise<Descriptions[]> {
    return this.descriptionsService.getUserDescriptions(
      req.user.id,
      'choreographer',
    );
  }

  @Get('/:id/requests')
  @Roles(['choreographer'])
  @UseGuards(JwtAuthGuard)
  async getRequestsByDescriptionId(@Param('id') id: number, @Req() req: any) {
    const users = await this.descriptionsService.getRequestsByDescriptionId(
      id,
      req.user.id,
    );
    return users;
  }

  @Get('/:id')
  async getDescriptionById(@Param('id') id: number): Promise<Descriptions> {
    return this.descriptionsService.getDescriptionById(id);
  }

  @Get('choreographers')
  async getAllDescriptionsByChoreographer(
    @Query('id') id: number,
  ): Promise<Descriptions[]> {
    return this.descriptionsService.getAllCurrentDescriptionsByChoreographer(
      id,
    );
  }

  @Get('/dance-styles')
  async getAllDescriptionsByStyle(
    @Query('id') id: number,
  ): Promise<Descriptions[]> {
    return this.descriptionsService.getAllCurrentDescriptionsByStyle(id);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Post()
  async addDescription(
    @Body() description: CreateDescriptionDto,
    @Req() req: any,
  ) {
    return this.descriptionsService.addDescription(description, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(['user', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Post('/:id/requests')
  async addRequest(@Param('id') id: number, @Req() req: any) {
    return this.requestsService.addRequest(req.user.login, id);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateDescription(
    @Body() description: CreateDescriptionDto,
    @Req() req: any,
    @Param('id') id: number,
  ) {
    return this.descriptionsService.updateDescription(
      id,
      req.user.id,
      description,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(['admin', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteDescription(@Req() req: any, @Param('id') id: number) {
    return this.descriptionsService.deleteDescription(id, req.user.id);
  }
}
