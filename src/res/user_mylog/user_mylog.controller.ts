import { Controller, Post, Body, Logger } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

import { CreateUserMylogDto } from './dto/create-user_mylog.dto'
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';

@Controller('user-mylog')
export class UserMylogController {
  private readonly logger = new Logger(UserMylogController.name);

  constructor(private readonly userMylogService: UserMylogService) {}

  @Post()
  async createUserMylog(
    @Body() createUserMylogDto: CreateUserMylogDto
  ): Promise<UserMylog> {
    this.logger.log('Received createUserMylog request', createUserMylogDto);
    const result = await this.userMylogService.createUserMylog(createUserMylogDto);
    this.logger.log('Saved user mylog', result);
    return result;
  }
}