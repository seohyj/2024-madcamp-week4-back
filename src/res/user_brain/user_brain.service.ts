import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBrain } from './user_brain.entity';

@Injectable()
export class UserBrainService {
  constructor(
    @InjectRepository(UserBrain)
    private userBrainRepository: Repository<UserBrain>,
  ) {}

  findAll(): Promise<UserBrain[]> {
    return this.userBrainRepository.find();
  }

  findOne(kakao_id: string, date: Date): Promise<UserBrain> {
    return this.userBrainRepository.findOne({ where: { kakao_id, date } });
  }

  create(brain: UserBrain): Promise<UserBrain> {
    return this.userBrainRepository.save(brain);
  }

  async update(kakao_id: string, date: Date, brain: Partial<UserBrain>): Promise<void> {
    await this.userBrainRepository.update({ kakao_id, date }, brain);
  }

  async remove(kakao_id: string, date: Date): Promise<void> {
    await this.userBrainRepository.delete({ kakao_id, date });
  }
}