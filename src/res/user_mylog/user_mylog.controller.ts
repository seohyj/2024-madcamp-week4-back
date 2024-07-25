import {  Controller, Post, Put, Body, Param, Logger, Get } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateWakeTimeDto, UpdateSleepTimeDto } from './dto/update-time.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto'; // UpdateEmotionDto 추가


@Controller('user-mylog')
export class UserMylogController {
  private readonly logger = new Logger(UserMylogController.name);

  constructor(private readonly userMylogService: UserMylogService) {}

  @Get(':kakao_id/:date')
  async getDiary(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: string,
  ): Promise<UserMylog> {
    this.logger.log(`Received getDiary request for kakao_id ${kakaoId} and date ${date}`);
    const result = await this.userMylogService.getDiary(kakaoId, date);
    this.logger.log('Fetched diary', result);
    return result;
  }

  @Post()
  async createDiary(
    @Body() createDiaryDto: CreateDiaryDto
  ): Promise<UserMylog> {
    this.logger.log('Received createDiary request', createDiaryDto);
    const result = await this.userMylogService.createDiary(createDiaryDto);
    this.logger.log('Saved diary', result);
    return result;
  }

  @Put(':kakao_id/:date')
  async updateDiary(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: string,
    @Body() updateDiaryDto: CreateDiaryDto
  ): Promise<UserMylog> {
    this.logger.log(`Received updateDiary request for kakao_id ${kakaoId} and date ${date}`, updateDiaryDto);
    const result = await this.userMylogService.updateDiary(kakaoId, date, updateDiaryDto);
    this.logger.log('Updated diary', result);
    return result;
  }

  @Put(':kakao_id/:date/wake-time')
  async updateWakeTime(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: Date,
    @Body() updateWakeTimeDto: UpdateWakeTimeDto
  ): Promise<UserMylog> {
    this.logger.log(`Received updateWakeTime request for kakao_id ${kakaoId} and date ${date}`, updateWakeTimeDto);
    const result = await this.userMylogService.updateWakeTime(kakaoId, date, updateWakeTimeDto);
    this.logger.log('Updated wake time', result);
    return result;
  }

  @Put(':kakao_id/:date/sleep-time')
  async updateSleepTime(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: Date,
    @Body() updateSleepTimeDto: UpdateSleepTimeDto
  ): Promise<UserMylog> {
    this.logger.log(`Received updateSleepTime request for kakao_id ${kakaoId} and date ${date}`, updateSleepTimeDto);
    const result = await this.userMylogService.updateSleepTime(kakaoId, date, updateSleepTimeDto);
    this.logger.log('Updated sleep time', result);
    return result;
  }

  @Get(':kakao_id/:date/emotion')
  async getEmotions(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: string
  ): Promise<UserMylog> {
    this.logger.log(`Received getEmotions request for kakao_id ${kakaoId} and date ${date}`);
    const result = await this.userMylogService.getEmotions(kakaoId, date);
    this.logger.log('Fetched emotions', result);
    return result;
  }

  @Post('emotion')
  async createEmotions(
    @Body() updateEmotionDto: UpdateEmotionDto
  ): Promise<UserMylog> {
    this.logger.log('Received createEmotions request', updateEmotionDto);
    const result = await this.userMylogService.createEmotions(updateEmotionDto);
    this.logger.log('Saved emotions', result);
    return result;
  }

  // 새로운 UpdateEmotion 메서드 추가
  @Put(':kakao_id/:date/emotion')
  async updateEmotions(
    @Param('kakao_id') kakaoId: string,
    @Param('date') date: string,
    @Body() updateEmotionDto: UpdateEmotionDto
  ): Promise<UserMylog> {
    this.logger.log(`Received updateEmotion(s) request for kakao_id ${kakaoId} and date ${date}`, updateEmotionDto);
    const result = await this.userMylogService.updateEmotions(kakaoId, date, updateEmotionDto);
    this.logger.log('Updated emotion', result);
    return result;
  }
}