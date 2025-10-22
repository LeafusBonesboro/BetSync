import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('ping')
  getPing() {
    return { message: 'pong 🏓', timestamp: new Date().toISOString() };
  }
}
