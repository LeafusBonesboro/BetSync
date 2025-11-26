import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // GET /analysis
  @Get()
  getAll() {
    return this.analysisService.getAll();
  }

  // GET /analysis/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.analysisService.getOne(id);
  }
}
