import { IsISO8601, IsNumber, IsString } from 'class-validator';

export class UpdateEmotionDto {
  @IsString()
  kakao_id: string;

  @IsISO8601()
  date: string;

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