import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule], // ✅ add this line
  controllers: [BetsController],
  providers: [BetsService, PrismaService],
  exports: [BetsService],
})
export class BetsModule {}
