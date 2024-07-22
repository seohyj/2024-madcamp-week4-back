import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [UserController],
  providers: [UserService, KakaoStrategy],
})
export class UserModule {}