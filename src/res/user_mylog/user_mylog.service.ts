import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMylog } from './user_mylog.entity';
import { CreateUserMylogDto } from './dto/create-user_mylog.dto';

@Injectable()
export class UserMylogService {
  constructor(
    @InjectRepository(UserMylog)
    private userMylogRepository: Repository<UserMylog>,
  ) {}

  // diary
  async createUserMylog(
    CreateUserMylogDto: CreateUserMylogDto
  ): Promise<UserMylog> {
    const newUserMylog = this.userMylogRepository.create(CreateUserMylogDto);
    return this.userMylogRepository.save(newUserMylog);
  }
}