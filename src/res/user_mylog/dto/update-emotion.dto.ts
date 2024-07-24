import { IsNumber } from 'class-validator';

export class UpdateEmotionDto {
  @IsNumber()
  hex_happy: number;

  @IsNumber()
  hex_sad: number;

  @IsNumber()
  hex_anger: number;

  @IsNumber()
  hex_fear: number;

  @IsNumber()
  hex_surprise: number;

  @IsNumber()
  hex_disgust: number;
}
