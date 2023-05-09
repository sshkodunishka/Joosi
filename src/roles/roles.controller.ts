import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles, Roles as RolesModel } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAllUsers(): Promise<RolesModel[]> {
    return this.rolesService.getAllRoles();
  }
}
