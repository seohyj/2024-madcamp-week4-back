import { Controller, Put, Param, Get, Post, Body, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';
import { GeminiService } from '../../api/gemini';

import { CreateUserMylogDto } from './dto/create-user_mylog.dto'
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';
import { UpdateSleepTimeDto } from './dto/update-sleep-time.dto';

@Controller('user-mylog')
export class UserMylogController {
  private readonly logger = new Logger(UserMylogController.name);

  constructor(
    private readonly userMylogService: UserMylogService,
    private readonly geminiService: GeminiService,
  ) {}

  // GET Diary
  @Get(':kakao_id/:date')
  async getDiary(
    @Param('kakao_id') kakao_id: string,
    @Param('date') date: string
  ) {
    const parsedDate = new Date(date);
    return this.userMylogService.findDiaryByDate(kakao_id, parsedDate);
  }

  // POST Diary
  @Post()
  async createDiary(
    @Body('kakao_id') kakao_id: string,
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
    @Param('kakao_id') kakao_id: string,
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
    @Param('kakao_id') kakao_id: string,
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
    @Param('kakao_id') kakao_id: string,
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

  // GET Quiz
  @Get(':kakao_id/quiz')
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
  }
}