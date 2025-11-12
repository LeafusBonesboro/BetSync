import { Controller, Get, Query } from '@nestjs/common';
import { BetPropsService } from './bet-props.service';

@Controller('bet-props')
export class BetPropsController {
  constructor(private readonly betPropsService: BetPropsService) {}

  @Get()
  async findAll(@Query('eventId') eventId?: string) {
    if (eventId) {
      return this.betPropsService.findByEventId(eventId);
    }
    return this.betPropsService.findAll();
  }
}
