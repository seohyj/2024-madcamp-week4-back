import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMylog } from './user_mylog.entity';
import { CreateUserMylogDto } from './dto/create-user_mylog.dto';
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';

@Injectable()
export class UserMylogService {
  private readonly logger = new Logger(UserMylogService.name);

  // diary, wake-time
  constructor(
    @InjectRepository(UserMylog)
    private userMylogRepository: Repository<UserMylog>,
  ) {}

  async createUserMylog(
    createUserMylogDto: CreateUserMylogDto,
  ): Promise<UserMylog> {
    this.logger.log('Creating new UserMylog entry', createUserMylogDto);
    const newUserMylog = this.userMylogRepository.create(createUserMylogDto);
    const savedUserMylog = await this.userMylogRepository.save(newUserMylog);
    this.logger.log('Saved new UserMylog entry', savedUserMylog);
    return savedUserMylog;
  }

  async findDiaryByDate(kakao_id: number, date: Date): Promise<UserMylog | undefined> {
    return this.userMylogRepository.findOne({ where: { kakao_id, date } });
  }

  async saveOrUpdateDiary(kakao_id: number, date: Date, title: string, context: string): Promise<UserMylog> {
    let diary = await this.findDiaryByDate(kakao_id, date);
    if (diary) {
      diary.title = title;
      diary.context = context;
    } else {
      diary = this.userMylogRepository.create({ kakao_id, date, title, context });
    }
    return this.userMylogRepository.save(diary);
  }

  async updateWakeTime(
    kakao_id: number,
    date: Date,
    wake_time: Date
  ): Promise<void> {
    await this.userMylogRepository.update({ kakao_id, date }, { wake_time });
  } 
  
  async updateSleepTime(
    kakao_id: number,
    date: Date,
    sleep_time: Date
  ): Promise<void> {
    await this.userMylogRepository.update({ kakao_id, date }, { sleep_time });
  }

  async getDiaryEntries(kakaoId: number): Promise<UserMylog[]> {
    return this.userMylogRepository.find({
      where: { kakao_id: kakaoId },
      order: { date: 'DESC' },
    });
  }
}