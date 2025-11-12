import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';

@Module({
  providers: [SheetsService],
  controllers: [SheetsController], // ✅ add this
  exports: [SheetsService],
})
export class SheetsModule {}
