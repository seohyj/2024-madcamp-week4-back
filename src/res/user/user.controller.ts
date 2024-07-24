import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import axios from 'axios';

// 이미 사용된 인가 코드를 저장할 메모리 객체 (실제 구현에서는 Redis나 데이터베이스를 사용)
const usedAuthorizationCodes = new Set<string>();

@Controller('user') // 'user' 경로로 들어오는 요청을 처리하는 컨트롤러
export class UserController {
  private readonly logger = new Logger(UserController.name); // 로깅을 위한 Logger 인스턴스 생성

  constructor(private readonly userService: UserService) {} // UserService를 의존성 주입

  @Get(':id') // GET /user/:id 경로를 처리하는 핸들러
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id); // UserService를 사용하여 유저를 조회
  }

  @Post() // POST /user 경로를 처리하는 핸들러
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user); // UserService를 사용하여 유저를 생성
  }

  @Put(':id') // PUT /user/:id 경로를 처리하는 핸들러
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<void> {
    return this.userService.update(id, user); // UserService를 사용하여 유저를 업데이트
  }

  @Delete(':id') // DELETE /user/:id 경로를 처리하는 핸들러
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id); // UserService를 사용하여 유저를 삭제
  }

  @Get('kakao') // GET /user/kakao 경로를 처리하는 핸들러
  @UseGuards(AuthGuard('kakao')) // 카카오 인증 가드를 사용
  kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션 (로직은 AuthGuard가 처리)
  }

  @Get('kakao/callback') // GET /user/kakao/callback 경로를 처리하는 핸들러
  async kakaoLoginCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string; // 요청에서 인가 코드를 추출

    // 이미 사용된 인가 코드인지 확인하는 로직
    if (usedAuthorizationCodes.has(code)) {
      this.logger.warn(`Authorization code ${code} has already been used.`);
      return res.status(400).json({ message: 'Authorization code has already been used.' });
    }

    this.logger.log(`Received authorization code: ${code}`); // 인가 코드를 로그로 출력

    try {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token'; // 액세스 토큰 요청 URL
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '43981b4342c384f0da37c5299cf17d88', // 클라이언트 ID
        redirect_uri: 'http://localhost:3000/user/kakao/callback', // 리디렉션 URI
        code, // 인가 코드
      });

      this.logger.log(`Requesting access token from: ${tokenUrl}`);
      this.logger.log(`With params: ${tokenParams.toString()}`);

      // 액세스 토큰 요청
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

      const { access_token } = tokenResponse.data; // 액세스 토큰 추출
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      this.logger.log(`User response: ${JSON.stringify(userResponse.data)}`); // 사용자 응답을 로그로 출력

      const kakaoId = userResponse.data.id; // 카카오 ID 추출
      const nickname = userResponse.data.kakao_account.profile.nickname || 'Unknown'; // 닉네임 추출

      const user = await this.userService.findOrCreate({
        kakao_id: kakaoId,
        nickname,
      });

      usedAuthorizationCodes.add(code); // 인가 코드를 사용된 것으로 표시

      res.json({ kakaoId: user.kakao_id }); // JSON 응답으로 사용자 정보 반환
    } catch (error) {
      this.logger.error('Kakao login failed', error.message); // 에러 메시지 로그로 출력

      if (error.response) {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response headers: ${JSON.stringify(error.response.headers)}`);
      }

      res.status(500).json({ message: 'Kakao login failed' }); // 에러 응답 반환
    }
  }

  @Get('kakao/nickname') // GET /user/kakao/nickname 경로를 처리하는 핸들러
  async getNickname(@Req() req: Request, @Res() res: Response) {
    const kakaoId = Number(req.query.kakao_id); // 요청에서 카카오 ID 추출 (number로 변환)

    try {
      const user = await this.userService.findOneByKakaoId(kakaoId); // 카카오 ID로 유저 조회
      if (user) {
        res.json({ nickname: user.nickname }); // 유저 닉네임 응답
      } else {
        res.status(404).json({ message: 'User not found' }); // 유저를 찾지 못한 경우 404 응답
      }
    } catch (error) {
      this.logger.error('Error fetching user nickname', error.message); // 에러 메시지 로그로 출력
      res.status(500).json({ message: 'Error fetching user nickname' }); // 에러 응답 반환
    }
  }
}
