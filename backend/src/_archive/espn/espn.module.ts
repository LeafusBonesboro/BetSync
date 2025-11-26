import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EspnController } from './espn.controller';
import { EspnService } from './espn.service';


@Module({
  imports: [HttpModule],
  controllers: [EspnController],
 
  exports: [EspnService], // ✅ <-- add this
})
export class EspnModule {}
