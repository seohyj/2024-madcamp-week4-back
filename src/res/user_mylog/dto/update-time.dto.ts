import { IsISO8601 } from 'class-validator';

export class UpdateWakeTimeDto {
  @IsISO8601()
  wake_time: string;
}

export class UpdateSleepTimeDto {
  @IsISO8601()
  sleep_time: string;
}
