import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import axios from 'axios';

// 이미 사용된 인가 코드를 저장할 메모리 객체 (실제 구현에서는 Redis나 데이터베이스를 사용)
const usedAuthorizationCodes = new Set<string>();


@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<void> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션 (로직은 AuthGuard가 처리)
  }

  @Get('kakao/callback')
  async kakaoLoginCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;

    // 이미 사용된 인가 코드인지 확인하는 로직
    if (usedAuthorizationCodes.has(code)) {
      this.logger.warn(`Authorization code ${code} has already been used.`);
      return res.status(400).json({ message: 'Authorization code has already been used.' });
    }

    this.logger.log(`Received authorization code: ${code}`); // 인가 코드를 로그로 출력

    try {
      // 액세스 토큰 요청 로그 추가
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '43981b4342c384f0da37c5299cf17d88',
        redirect_uri: 'http://localhost:3000/user/kakao/callback', // 기존의 URI 확인
        code,
      });

      this.logger.log(`Requesting access token from: ${tokenUrl}`);
      this.logger.log(`With params: ${tokenParams.toString()}`);

      const tokenResponse = await axios.post(
        tokenUrl,
        tokenParams.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log(`Token response: ${JSON.stringify(tokenResponse.data)}`); // 토큰 응답을 로그로 출력

      const { access_token } = tokenResponse.data;
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      this.logger.log(`User response: ${JSON.stringify(userResponse.data)}`); // 사용자 응답을 로그로 출력

      const kakaoId = userResponse.data.id;
      const nickname = userResponse.data.kakao_account.profile.nickname || 'Unknown';

      const user = await this.userService.findOrCreate({
        kakao_id: kakaoId,
        nickname,
      });

      // 인가 코드를 사용된 것으로 표시
      usedAuthorizationCodes.add(code);

      // JSON 응답으로 사용자 정보 반환
      res.json({ kakaoId: user.kakao_id });
    } catch (error) {
      this.logger.error('Kakao login failed', error.message); // 에러 메시지 로그로 출력

      if (error.response) {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response headers: ${JSON.stringify(error.response.headers)}`);
      }

      res.status(500).json({ message: 'Kakao login failed' });
    }
  }
  

}
