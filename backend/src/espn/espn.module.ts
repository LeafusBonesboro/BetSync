import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EspnController } from './espn.controller';
import { EspnService } from './espn.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [EspnController],
  providers: [EspnService, PrismaService],
})
export class EspnModule {}
