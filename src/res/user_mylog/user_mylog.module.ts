import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMylogController } from './user_mylog.controller';
import { UserMylogService } from './user_mylog.service';
import { UserMylog } from './user_mylog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMylog])],
  controllers: [UserMylogController],
  providers: [UserMylogService],
})
export class UserMylogModule {}