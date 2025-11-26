import { Controller, Post } from '@nestjs/common';
import { SheetPropsService } from './sheet-props.service';

@Controller('api/sheet-props')
export class SheetPropsController {
  constructor(private readonly sheetPropsService: SheetPropsService) {}

  @Post('sync')
  async syncFromSheet() {
    return this.sheetPropsService.syncFromSheet();
  }
}
