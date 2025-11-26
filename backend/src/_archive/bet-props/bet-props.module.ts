import { Module } from '@nestjs/common';
import { BetPropsController } from './bet-props.controller';


import { EspnModule } from '../espn/espn.module'; // ✅ use the module instead

@Module({
  imports: [EspnModule],
  controllers: [BetPropsController],
 

})
export class BetPropsModule {}
