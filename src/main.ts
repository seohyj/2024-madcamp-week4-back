import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// 환경 변수 로드
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ConfigService를 사용하여 환경 변수에서 포트를 가져옵니다.
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001); // 기본값으로 3001을 사용

  app.enableCors();  // CORS 설정

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
