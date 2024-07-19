import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.UserRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.UserRepository.findOne({ where: { kakao_id: id } });
  }

  create(user: User): Promise<User> {
    return this.UserRepository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await this.UserRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    await this.UserRepository.delete(id);
  }
}