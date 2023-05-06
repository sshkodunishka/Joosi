import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests, Requests as RequestsModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getAllRequests(): Promise<RequestsModel[]> {
    return this.requestsService.getAllRequests();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteRequest(@Param('id') id: number, @Req() req: any) {
    return this.requestsService.deleteRequest(id, req.user.login);
  }
}
