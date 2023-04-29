import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DescriptionsService } from './descriptions.service';
import { Descriptions } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guards';
import { CreateDescriptionDto } from './dto/create-description.dto';

@Controller('descriptions')
export class DescriptionsController {
  constructor(private readonly descriptionsService: DescriptionsService) {}

  @Get()
  async getAllDescriptions(): Promise<Descriptions[]> {
    return this.descriptionsService.getAllDescriptions();
  }

  @UseGuards(RolesGuard)
  @Roles(['admin', 'choreographer'])
  @UseGuards(JwtAuthGuard)
  @Post('/create-description')
  async addDescription(
    @Body() description: CreateDescriptionDto,
    @Req() req: any,
  ) {
    return this.descriptionsService.addDescription(description, req.user.id);
  }
}
