import { Module } from '@nestjs/common';
import { SheetPropsService } from './sheet-props.service';
import { SheetPropsController } from './sheet-props.controller';
import { SheetsModule } from '../sheets/sheets.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [SheetsModule, PrismaModule],
  controllers: [SheetPropsController],
  providers: [SheetPropsService],
})
export class SheetPropsModule {}
