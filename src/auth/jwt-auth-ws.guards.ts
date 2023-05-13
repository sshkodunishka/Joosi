import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        throw new WsException({ message: 'user is not authorized' });
      }
      const user = this.jwtService.verify(token);
      client.user = user;
      return true;
    } catch (e) {
      throw new WsException({ message: 'user is not authorized' });
    }
  }
}
