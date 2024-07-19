import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserBrainService } from './user_brain.service';
import { UserBrain } from './user_brain.entity';

@Controller('user-brain')
export class UserBrainController {
  constructor(private readonly userBrainService: UserBrainService) {}

  @Get()
  findAll(): Promise<UserBrain[]> {
    return this.userBrainService.findAll();
  }

  @Get(':kakao_id/:date')
  findOne(@Param('kakao_id') kakao_id: number, @Param('date') date: Date): Promise<UserBrain> {
    return this.userBrainService.findOne(kakao_id, date);
  }

  @Post()
  create(@Body() brain: UserBrain): Promise<UserBrain> {
    return this.userBrainService.create(brain);
  }

  @Put(':kakao_id/:date')
  update(@Param('kakao_id') kakao_id: number, @Param('date') date: Date, @Body() brain: Partial<UserBrain>): Promise<void> {
    return this.userBrainService.update(kakao_id, date, brain);
  }

  @Delete(':kakao_id/:date')
  remove(@Param('kakao_id') kakao_id: number, @Param('date') date: Date): Promise<void> {
    return this.userBrainService.remove(kakao_id, date);
  }
}