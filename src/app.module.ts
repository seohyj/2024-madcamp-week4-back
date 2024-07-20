// connection with MySQL
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/res/user/user.module';
import { UserMylogModule } from '../src/res/user_mylog/user_mylog.module';
import { UserBrainModule } from '../src/res/user_brain/user_brain.module';

@Module({
  imports: [
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
})
export class AppModule {}