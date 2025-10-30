import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { HttpModule } from '@nestjs/axios';
import { EspnModule } from '../espn/espn.module';
import { OcrController } from './ocr.controller';

@Module({
  imports: [HttpModule, EspnModule],
  controllers: [OcrController],
  providers: [OcrService],
  exports: [OcrService], // so BetsModule or others can use it
})
export class OcrModule {}
