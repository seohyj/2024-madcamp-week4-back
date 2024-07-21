import { IsDate } from 'class-validator';

export class UpdateWakeTimeDto {
  @IsDate()
  wake_time: Date;
}