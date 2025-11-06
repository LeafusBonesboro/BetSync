import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  async create(@Body() body) {
  console.log('🧾 Incoming body:', body);
  return this.betsService.create(body);
}


  @Get()
  async findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.betsService.findOne(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.betsService.delete(Number(id));
  }
}
