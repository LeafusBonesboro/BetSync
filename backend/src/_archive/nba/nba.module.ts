import { Module } from '@nestjs/common';
import { NbaController } from './nba.controller';
import { NbaService } from './nba.service';


@Module({
  controllers: [NbaController],
 
})
export class NbaModule {}
