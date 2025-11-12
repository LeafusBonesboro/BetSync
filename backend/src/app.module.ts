import { Module } from '@nestjs/common';
import { BetsModule } from './bets/bets.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspnModule } from './espn/espn.module';
import { AnalysisModule } from './analysis/analysis.module';
import { OcrModule } from './ocr/ocr.module';
import { NbaModule } from './nba/nba.module';
import { SheetsModule } from './sheets/sheets.module'; // ✅ <-- Add this
import { SheetPropsModule } from './sheet-props/sheet-props.module';
import { BetPropsModule } from './bet-props/bet-props.module';

@Module({
  imports: [
    PrismaModule,
    EspnModule,
    BetsModule,
    AnalysisModule,
    OcrModule,
    NbaModule,
    SheetsModule,
    SheetPropsModule,
    BetPropsModule,
  ],
})
export class AppModule {}
