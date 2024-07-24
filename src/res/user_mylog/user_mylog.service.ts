import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMylog } from './user_mylog.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateWakeTimeDto, UpdateSleepTimeDto } from './dto/update-time.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto'; // UpdateEmotionDto 추가


@Injectable()
export class UserMylogService {
  private readonly logger = new Logger(UserMylogService.name);

  constructor(
    @InjectRepository(UserMylog)
    private userMylogRepository: Repository<UserMylog>,
  ) {}

  // 날짜 문자열을 Date 객체로 변환하는 헬퍼 함수
  private convertToDate(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0); // 시간 부분을 초기화
    return date;
  }

  async getDiary(kakaoId: number, date: string): Promise<UserMylog> {
    this.logger.log('Fetching diary entry', { kakaoId, date });
    const dateObj = this.convertToDate(date); // 문자열을 Date 객체로 변환
    this.logger.log('Converted date object:', JSON.stringify(dateObj));
    const diary = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
    this.logger.log('Diary entry fetched:', JSON.stringify(diary));
    return diary;
  }

  async createDiary(createDiaryDto: CreateDiaryDto): Promise<UserMylog> {
    this.logger.log('Creating new diary entry', createDiaryDto);
    const newDiary = this.userMylogRepository.create(createDiaryDto);
    const savedDiary = await this.userMylogRepository.save(newDiary);
    this.logger.log('Saved new diary entry', JSON.stringify(savedDiary));
    return savedDiary;
  }

  async updateDiary(kakaoId: number, date: string, updateDiaryDto: CreateDiaryDto): Promise<UserMylog> {
    this.logger.log('Updating diary entry', { kakaoId, date, ...updateDiaryDto });
    const dateObj = this.convertToDate(date); // 문자열을 Date 객체로 변환
    const diary = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
    if (!diary) {
      throw new Error('Diary not found');
    }

    diary.title = updateDiaryDto.title;
    diary.context = updateDiaryDto.context;

    const updatedDiary = await this.userMylogRepository.save(diary);
    this.logger.log('Updated diary entry', JSON.stringify(updatedDiary));

    return updatedDiary;
  }

  async updateWakeTime(
    kakaoId: number,
    date: Date,
    updateWakeTimeDto: UpdateWakeTimeDto
  ): Promise<UserMylog> {
    this.logger.log('Updating wake time', { kakaoId, date, ...updateWakeTimeDto });
    const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date } });
    if (!userMylog) {
      throw new Error('User log not found');
    }
  
    const wakeTime = new Date(updateWakeTimeDto.wake_time);
    wakeTime.setHours(wakeTime.getHours() + 9); // Convert to KST
  
    userMylog.wake_time = wakeTime;
    return this.userMylogRepository.save(userMylog);
  }
  
  // Similar changes for updateSleepTime method
  async updateSleepTime(
    kakaoId: number,
    date: Date,
    updateSleepTimeDto: UpdateSleepTimeDto
  ): Promise<UserMylog> {
    this.logger.log('Updating sleep time', { kakaoId, date, ...updateSleepTimeDto });
    const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date } });
    if (!userMylog) {
      throw new Error('User log not found');
    }
  
    const sleepTime = new Date(updateSleepTimeDto.sleep_time);
    sleepTime.setHours(sleepTime.getHours() + 9); // Convert to KST
  
    userMylog.sleep_time = sleepTime;
    return this.userMylogRepository.save(userMylog);
  }

  // 새로운 updateEmotion 메서드 추가
  async updateEmotion(kakaoId: number, date: string, updateEmotionDto: UpdateEmotionDto): Promise<UserMylog> {
    this.logger.log('Updating emotion', { kakaoId, date, ...updateEmotionDto });
    const dateObj = this.convertToDate(date);
    const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
    if (!userMylog) {
      throw new Error('User log not found');
    }

    userMylog.hex_happy = updateEmotionDto.hex_happy;
    userMylog.hex_sad = updateEmotionDto.hex_sad;
    userMylog.hex_anger = updateEmotionDto.hex_anger;
    userMylog.hex_fear = updateEmotionDto.hex_fear;
    userMylog.hex_surprise = updateEmotionDto.hex_surprise;
    userMylog.hex_disgust = updateEmotionDto.hex_disgust;

    return this.userMylogRepository.save(userMylog);
  }

}