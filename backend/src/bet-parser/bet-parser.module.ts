import { Module } from '@nestjs/common';
import { BetParserService } from './bet-parser.service';
import { HttpModule } from '@nestjs/axios';
import { EspnModule } from '../espn/espn.module';

@Module({
  imports: [HttpModule, EspnModule],
  providers: [BetParserService],
  exports: [BetParserService], // allow BetsModule (and others) to use it
})
export class BetParserModule {}
