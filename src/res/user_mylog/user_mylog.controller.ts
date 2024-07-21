import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

import { CreateUserMylogDto } from './dto/create-user_mylog.dto'
import { UpdateWakeTimeDto } from './dto/update-wake-time.dto';

@Controller('user-mylog')
export class UserMylogController {
  constructor(private readonly userMylogService: UserMylogService) {}

  @Post()
  async createUserMylog(
    @Body() createUserMylogDto: CreateUserMylogDto
  ): Promise<UserMylog> {
    return this.userMylogService.createUserMylog(createUserMylogDto);
  }
}