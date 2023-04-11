import { Controller, Get } from '@nestjs/common';
import { DescriptionsService } from './descriptions.service';
import { Descriptions } from '@prisma/client';

@Controller('descriptions')
export class DescriptionsController {
  constructor(private readonly descriptionsService: DescriptionsService) {}

  @Get()
  async getAllDescriptions(): Promise<Descriptions[]> {
    return this.descriptionsService.getAllDescriptions();
  }
}
