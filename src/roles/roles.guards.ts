import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles---- ' + roles);
    if (!roles) {
      return true;
    }
    const ids = [];

    for (let i = 0; i < roles.length; i++) {
      const id = this.prisma.roles.findUnique({ where: { role: roles[i] } });
      ids.push(id);
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(JSON.stringify(user, null, 2));
    console.log('????????' + ids == user.roleId);
    if (ids == user.roleId) {
      return ids == user.roleId;
    } else {
      throw new UnauthorizedException({ message: 'user has no rights' });
    }
  }
}
