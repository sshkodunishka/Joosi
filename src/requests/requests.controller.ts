import { Controller, Get } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests, Requests as RequestsModel } from '@prisma/client';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getAllRequests(): Promise<RequestsModel[]> {
    return this.requestsService.getAllRequests();
  }
}
