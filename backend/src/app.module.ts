import { Module } from '@nestjs/common';
import { BetsModule } from './bets/bets.module';
import { PrismaModule } from './prisma/prisma.module';
import { EspnModule } from './espn/espn.module';
import { AnalysisModule } from './analysis/analysis.module';
import { OcrModule } from './ocr/ocr.module'; // ✅ Add this line



@Module({
  imports: [
    PrismaModule,
    EspnModule,
    BetsModule,
    AnalysisModule,
    OcrModule, // ✅ Add this to the imports
  ]
  
})
export class AppModule {}
