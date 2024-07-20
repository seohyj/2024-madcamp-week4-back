import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMylog } from './user_mylog.entity';

@Injectable()
export class UserMylogService {
  constructor(
    @InjectRepository(UserMylog)
    private userMylogRepository: Repository<UserMylog>,
  ) {}

  findAll(): Promise<UserMylog[]> {
    return this.userMylogRepository.find();
  }

  findOne(kakao_id: number, date: Date): Promise<UserMylog> {
    return this.userMylogRepository.findOne({ where: { kakao_id, date } });
  }

  create(log: UserMylog): Promise<UserMylog> {
    return this.userMylogRepository.save(log);
  }

  async update(kakao_id: number, date: Date, log: Partial<UserMylog>): Promise<void> {
    await this.userMylogRepository.update({ kakao_id, date }, log);
  }

  async remove(kakao_id: number, date: Date): Promise<void> {
    await this.userMylogRepository.delete({ kakao_id, date });
  }

  async updateWakeTime(
    kakao_id: number,
    date: Date,
    wake_time: Date
  ): Promise<void> {
    await this.userMylogRepository.update({kakao_id, date}, {wake_time});
  }
}