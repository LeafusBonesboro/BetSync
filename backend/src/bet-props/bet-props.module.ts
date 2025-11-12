import { Module } from '@nestjs/common';
import { BetPropsController } from './bet-props.controller';
import { BetPropsService } from './bet-props.service';
import { PrismaService } from '../prisma/prisma.service';
import { EspnModule } from '../espn/espn.module'; // ✅ use the module instead

@Module({
  imports: [EspnModule],
  controllers: [BetPropsController],
  providers: [BetPropsService, PrismaService],
  exports: [BetPropsService],
})
export class BetPropsModule {}
