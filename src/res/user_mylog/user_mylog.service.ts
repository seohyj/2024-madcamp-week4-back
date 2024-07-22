import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMylog } from './user_mylog.entity';
import { CreateUserMylogDto } from './dto/create-user_mylog.dto';

@Injectable()
export class UserMylogService {
  private readonly logger = new Logger(UserMylogService.name);

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
}