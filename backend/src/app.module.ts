import { Module } from '@nestjs/common';
import { BetsModule } from './bets/bets.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspnModule } from './espn/espn.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [PrismaModule, EspnModule, BetsModule, AnalysisModule],
})
export class AppModule {}
