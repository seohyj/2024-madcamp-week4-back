import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 환경 변수 로드
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
