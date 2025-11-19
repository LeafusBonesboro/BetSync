import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class BetsGateway {
  @WebSocketServer()
  server!: Server;

  // User will join room = their userId
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.join(userId);
    console.log(`📡 User joined room: ${userId}`);
  }

  // Called by BetsService when a bet is created
  emitNewBet(userId: string, bet: any) {
    console.log(`📡 Emitting new bet to ${userId}`);
    this.server.to(userId).emit('bet:new', bet);
  }
}
