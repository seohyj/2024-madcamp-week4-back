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

  async getDiary(kakaoId: string, date: string): Promise<UserMylog> {
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

  async updateDiary(kakaoId: string, date: string, updateDiaryDto: CreateDiaryDto): Promise<UserMylog> {
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
    kakaoId: string,
    date: Date,
    updateWakeTimeDto: UpdateWakeTimeDto
  ): Promise<UserMylog> {
    this.logger.log('Updating wake time', { kakaoId, date, ...updateWakeTimeDto });
    const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date } });
    if (!userMylog) {
      throw new Error('User log not found');
    }
  
    const wakeTime = new Date(updateWakeTimeDto.wake_time);
    
  
    userMylog.wake_time = wakeTime;
    return this.userMylogRepository.save(userMylog);
  }
  
  // Similar changes for updateSleepTime method
  async updateSleepTime(
    kakaoId: string,
    date: Date,
    updateSleepTimeDto: UpdateSleepTimeDto
  ): Promise<UserMylog> {
    this.logger.log('Updating sleep time', { kakaoId, date, ...updateSleepTimeDto });
    const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date } });
    if (!userMylog) {
      throw new Error('User log not found');
    }
  
    const sleepTime = new Date(updateSleepTimeDto.sleep_time);
    
  
    userMylog.sleep_time = sleepTime;
    return this.userMylogRepository.save(userMylog);
  }

  async getEmotions(kakaoId: string, date: string): Promise<UserMylog> {
    this.logger.log('Fetching emotion entry', { kakaoId, date });
    const dateObj = this.convertToDate(date); // 문자열을 Date 객체로 변환
    this.logger.log('Converted date object:', JSON.stringify(dateObj));
    const emotions = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
    this.logger.log('Emotion entry fetched:', JSON.stringify(emotions));
    return emotions;
  }

  async createEmotions(updateEmotionDto: UpdateEmotionDto): Promise<UserMylog> {
    this.logger.log('Creating new emotion entry', updateEmotionDto);
    const dateObj = this.convertToDate(updateEmotionDto.date); // 문자열을 Date 객체로 변환
    const existingDiary = await this.userMylogRepository.findOne({ where: { kakao_id: updateEmotionDto.kakao_id, date: dateObj } });
    
    if (!existingDiary) {
      throw new Error('Diary not found for the given kakao_id and date');
    }

    existingDiary.hex_happy = updateEmotionDto.hex_happy;
    existingDiary.hex_sad = updateEmotionDto.hex_sad;
    existingDiary.hex_anger = updateEmotionDto.hex_anger;
    existingDiary.hex_fear = updateEmotionDto.hex_fear;
    existingDiary.hex_surprise = updateEmotionDto.hex_surprise;
    existingDiary.hex_disgust = updateEmotionDto.hex_disgust;

    const savedEmotions = await this.userMylogRepository.save(existingDiary);
    this.logger.log('Saved new emotion entry', JSON.stringify(savedEmotions));
    return savedEmotions;
  }

  // 새로운 updateEmotion 메서드 추가
  async updateEmotions(kakaoId: string, date: string, updateEmotionDto: UpdateEmotionDto): Promise<UserMylog> {
    this.logger.log('Updating emotion entry', { kakaoId, date, ...updateEmotionDto });
    const dateObj = this.convertToDate(date); // 문자열을 Date 객체로 변환
    const diary = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
    if (!diary) {
      throw new Error('Diary not found');
    }

    diary.hex_happy = updateEmotionDto.hex_happy;
    diary.hex_sad = updateEmotionDto.hex_sad;
    diary.hex_anger = updateEmotionDto.hex_anger;
    diary.hex_fear = updateEmotionDto.hex_fear;
    diary.hex_surprise = updateEmotionDto.hex_surprise;
    diary.hex_disgust = updateEmotionDto.hex_disgust;

    const updatedEmotions = await this.userMylogRepository.save(diary);
    this.logger.log('Updated emotion entry', JSON.stringify(updatedEmotions));

    return updatedEmotions;
  }
  
  // async updateEmotion(kakaoId: string, date: string, updateEmotionDto: UpdateEmotionDto): Promise<UserMylog> {
  //   this.logger.log('Updating emotion', { kakaoId, date, ...updateEmotionDto });
  //   const dateObj = this.convertToDate(date);
  //   const userMylog = await this.userMylogRepository.findOne({ where: { kakao_id: kakaoId, date: dateObj } });
  //   if (!userMylog) {
  //     throw new Error('User log not found');
  //   }

  //   userMylog.hex_happy = updateEmotionDto.hex_happy;
  //   userMylog.hex_sad = updateEmotionDto.hex_sad;
  //   userMylog.hex_anger = updateEmotionDto.hex_anger;
  //   userMylog.hex_fear = updateEmotionDto.hex_fear;
  //   userMylog.hex_surprise = updateEmotionDto.hex_surprise;
  //   userMylog.hex_disgust = updateEmotionDto.hex_disgust;

  //   return this.userMylogRepository.save(userMylog);
  // }

}