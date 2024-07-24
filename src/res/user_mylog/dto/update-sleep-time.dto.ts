import { IsDate } from 'class-validator';

export class UpdateSleepTimeDto {
  @IsDate()
  sleep_time: Date;
}