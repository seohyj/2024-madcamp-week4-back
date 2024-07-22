import { Controller, Put, Param, Get, Post, Body, Logger } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

import { CreateUserMylogDto } from './dto/create-user_mylog.dto'
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';
import { UpdateSleepTimeDto } from './dto/update-sleep-time.dto';

@Controller('user-mylog')
export class UserMylogController {
  private readonly logger = new Logger(UserMylogController.name);

  constructor(private readonly userMylogService: UserMylogService) {}

  // GET Diary
  @Get(':kakao_id/:date')
  async getDiary(
    @Param('kakao_id') kakao_id: number,
    @Param('date') date: string
  ) {
    const parsedDate = new Date(date);
    return this.userMylogService.findDiaryByDate(kakao_id, parsedDate);
  }

  // POST Diary
  @Post()
  async createDiary(
    @Body('kakao_id') kakao_id: number,
    @Body('date') date: string,
    @Body('title') title: string,
    @Body('context') context: string
  ) {
    const parsedDate = new Date(date);
    return this.userMylogService.saveOrUpdateDiary(kakao_id, parsedDate, title, context);
  }

  // PUT Diary
  @Put(':kakao_id/:date')
  async updateDiary(
    @Param('kakao_id') kakao_id: number,
    @Param('date') date: string,
    @Body('title') title: string,
    @Body('context') context: string
  ) {
    const parsedDate = new Date(date);
    return this.userMylogService.saveOrUpdateDiary(kakao_id, parsedDate, title, context);
  }

  // wake-time update
  @Put(':kakao_id/:date/wake-time')
  async updateWakeTime(
    @Param('kakao_id') kakao_id: number,
    @Param('date') date: string,
    @Body() updateWakeTimeDto: UpdateWakeTimeDto,
  ): Promise<void> {
    const parsedDate = new Date(date);
    await this.userMylogService.updateWakeTime(
      kakao_id, 
      parsedDate,
      updateWakeTimeDto.wake_time
    );
  }

  // sleep-time update
  @Put(':kakao_id/:date/sleep-time')
  async updateSleepTime(
    @Param('kakao_id') kakao_id: number,
    @Param('date') date: string,
    @Body() updateSleepTimeDto: UpdateSleepTimeDto,
  ): Promise<void> {
    const parsedDate = new Date(date);
    await this.userMylogService.updateSleepTime(
      kakao_id, 
      parsedDate,
      updateSleepTimeDto.sleep_time
    );
  }
}