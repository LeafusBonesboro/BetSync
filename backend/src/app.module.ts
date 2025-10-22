import { Module } from '@nestjs/common';
import { BetsModule } from './bets/bets.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BetsModule],
})
export class AppModule {}
