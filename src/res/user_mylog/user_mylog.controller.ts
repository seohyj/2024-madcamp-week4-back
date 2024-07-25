import { Controller, Put, Param, Get, Post, Body, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';
import { GeminiService } from '../Gemini';

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

  // @Post('emotion')
  // async createEmotions(
  //   @Body() updateEmotionDto: UpdateEmotionDto
  // ): Promise<any> { // UserMylog 대신 필요한 필드만 반환하도록 타입 변경
  //   this.logger.log('Received createEmotions request', updateEmotionDto);
  //   const result = await this.userMylogService.createEmotions(updateEmotionDto);
  //   this.logger.log('Saved emotions', result);
  //   return result;
  // }


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

  /*@Get(':kakao_id/quiz')
  async getQuiz(@Param('kakao_id') kakaoId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const diaryEntries = await this.userMylogService.getDiaryEntries(kakaoId, today);

      if (diaryEntries.length < 3) {
        throw new HttpException(
          '퀴즈를 생성할 충분한 일기 항목이 없습니다.',
          HttpStatus.BAD_REQUEST
        );
      }

      const randomEntries = diaryEntries.sort(() => 0.5 - Math.random()).slice(0, 3);
      const questions = await Promise.all(
        randomEntries.map(async (entry) => {
          try {
            const generatedQuestions = await this.geminiService.generateQuestions([entry.context]);
            if (generatedQuestions.length > 0) {
              return generatedQuestions[0]; // 각 일기 항목에서 첫 번째 질문만 사용
            } else {
              console.warn(`No questions generated for entry: ${entry.context}`);
              return null;
            }
          } catch (error) {
            console.error(`Error generating question for entry: ${entry.context}`, error);
            return null;
          }
        })
      );

      // null 값 제거 (생성되지 않은 질문)
      const validQuestions = questions.filter(question => question !== null);

      if (validQuestions.length === 0) {
        throw new HttpException(
          '퀴즈를 생성할 수 있는 유효한 질문이 없습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        status: 'success',
        data: validQuestions,
      };
    } catch (error) {
      console.error('Unexpected error in getQuiz:', error);
      throw new HttpException(
        '서버 내부 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }*/
}