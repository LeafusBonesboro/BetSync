import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { BetsGateway } from './bets.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService, BetsGateway, PrismaService],
  exports: [BetsGateway],
})
export class BetsModule {}
