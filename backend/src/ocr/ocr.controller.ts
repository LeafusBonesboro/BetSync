// src/ocr/ocr.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { ParsedBetDto } from '../bets/dto/parsed-bet.dto';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  async parseImage(@Body('imageUrl') imageUrl: string): Promise<ParsedBetDto> {
    if (!imageUrl) {
      throw new BadRequestException('Missing imageUrl');
    }

    return this.ocrService.processImageFromUrl(imageUrl);
  }
}
