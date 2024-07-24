import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBrain } from './user_brain.entity';
import { UserBrainService } from './user_brain.service';
import { UserBrainController } from './user_brain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBrain])],
  providers: [UserBrainService],
  controllers: [UserBrainController],
})
export class UserBrainModule {}