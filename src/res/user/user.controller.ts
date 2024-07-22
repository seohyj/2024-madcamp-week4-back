import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('User')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  /*@Get()
  findAll(): Promise<User[]> {
    return this.UserService.findAll();
  }*/

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.UserService.findOne(id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.UserService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<void> {
    return this.UserService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.UserService.remove(id);
  }


  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoLoginCallback(@Req() req: Request) {
    // 카카오 로그인 성공 시 콜백
    return req.user;
  }
  
}