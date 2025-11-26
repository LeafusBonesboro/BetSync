import { Controller, Get } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('api/sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('test')
  async testConnection() {
    const result = await this.sheetsService.testConnection();
    return { message: result, timestamp: new Date().toISOString() };
  }
}
