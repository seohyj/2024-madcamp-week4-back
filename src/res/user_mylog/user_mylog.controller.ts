import { Controller, Put, Param, Post, Body, Logger } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

import { CreateUserMylogDto } from './dto/create-user_mylog.dto'
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';

@Controller('user-mylog')
export class UserMylogController {
  private readonly logger = new Logger(UserMylogController.name);

  constructor(private readonly userMylogService: UserMylogService) {}

  // diary
  @Post()
  async createUserMylog(
    @Body() createUserMylogDto: CreateUserMylogDto
  ): Promise<UserMylog> {
    this.logger.log('Received createUserMylog request', createUserMylogDto);
    const result = await this.userMylogService.createUserMylog(createUserMylogDto);
    this.logger.log('Saved user mylog', result);
    return result;
  }

  // wake-time update
  @Put(':kakao_id/:date/wake-time')
  async updateWakeTime(
    @Param('kakao_id') kakao_id: number,
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
}