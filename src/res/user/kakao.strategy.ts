import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { Injectable,Logger } from '@nestjs/common';
import { UserService } from './user.service';


@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private readonly logger = new Logger(KakaoStrategy.name); // Initialize logger
  constructor(private userService: UserService) {
    super({
      clientID: '43981b4342c384f0da37c5299cf17d88', // must: 카카오 개발자 사이트에서 발급받은 REST API 키로 대체
      callbackURL: 'http://localhost:3000/user/kakao/callback', // must: 콜백 URL 설정
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<any> {
    this.logger.log(`Kakao profile: ${JSON.stringify(profile)}`); // 프로파일 로그
    
    const { id, username } = profile;
    
    const kakaoId = id.toString();
    const user = await this.userService.findOrCreate({ kakao_id: kakaoId, nickname: username });
    done(null, user);
  }
}
