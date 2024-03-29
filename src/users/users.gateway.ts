import { OnGatewayConnection } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface.d';
import { Injectable, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsJwtAuthGuard } from 'src/auth/jwt-auth-ws.guards';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';

@Injectable()
@WebSocketGateway({
  path: '/api/websocket',
  cors: '*:*',
})
export class UsersGateway {
  constructor(private userService: UsersService) {}
  @WebSocketServer() server;
  messages: {
    user: Users;
    message: string;
  }[] = [];

  @SubscribeMessage('message')
  @UseGuards(WsJwtAuthGuard)
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ) {
    const user = await this.userService.getUserById(client.user.id);
    const message = {
      user,
      message: data,
    };
    this.messages.push(message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('history')
  @UseGuards(WsJwtAuthGuard)
  async getAllMessage(@ConnectedSocket() clientSocket: any) {
    clientSocket.emit('history', this.messages);
  }
}
