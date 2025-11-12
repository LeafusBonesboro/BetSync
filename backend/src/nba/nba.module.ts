import { Module } from '@nestjs/common';
import { NbaController } from './nba.controller';
import { NbaService } from './nba.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [NbaController],
  providers: [NbaService, PrismaService],
})
export class NbaModule {}
