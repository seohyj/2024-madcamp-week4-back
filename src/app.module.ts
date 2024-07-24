// connection with MySQL
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './res/user/user.module';
import { UserMylogModule } from './res/user_mylog/user_mylog.module';
import { UserBrainModule } from './res/user_brain/user_brain.module';
import { AppController } from './app.controller'; // for test
import { AppService } from './app.service'; // for test

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    UserMylogModule,
    UserBrainModule,
  ],
  controllers: [AppController], // for test
  providers: [AppService],
})
export class AppModule {}