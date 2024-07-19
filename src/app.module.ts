import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/res/user/user.module';
import { UserMylogModule } from '../src/res/user_mylog/user_mylog.module';
import { UserBrainModule } from '../src/res/user_brain/user_brain.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    UserMylogModule,
    UserBrainModule,
  ],
})
export class AppModule {}