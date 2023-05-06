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
    return this.descriptionsService.getAllCurrentDescriptions();
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
