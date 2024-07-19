import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

@Controller('user-mylog')
export class UserMylogController {
  constructor(private readonly userMylogService: UserMylogService) {}

  @Get()
  findAll(): Promise<UserMylog[]> {
    return this.userMylogService.findAll();
  }

  @Get(':kakao_id/:date')
  findOne(@Param('kakao_id') kakao_id: number, @Param('date') date: Date): Promise<UserMylog> {
    return this.userMylogService.findOne(kakao_id, date);
  }

  @Post()
  create(@Body() log: UserMylog): Promise<UserMylog> {
    return this.userMylogService.create(log);
  }

  @Put(':kakao_id/:date')
  update(@Param('kakao_id') kakao_id: number, @Param('date') date: Date, @Body() log: Partial<UserMylog>): Promise<void> {
    return this.userMylogService.update(kakao_id, date, log);
  }

  @Delete(':kakao_id/:date')
  remove(@Param('kakao_id') kakao_id: number, @Param('date') date: Date): Promise<void> {
    return this.userMylogService.remove(kakao_id, date);
  }
}