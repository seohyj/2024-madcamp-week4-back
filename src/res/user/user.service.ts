import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // User 엔티티를 주입
    private userRepository: Repository<User>,
  ) {}

  findOne(id: string  ): Promise<User> {
    return this.userRepository.findOne({ where: { kakao_id: id } }); // ID로 유저 조회
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user); // 유저 생성 및 저장
  }

  update(id: string, user: Partial<User>): Promise<void> {
    return this.userRepository.update(id, user).then(() => {}); // 유저 업데이트
  }

  remove(id: string): Promise<void> {
    return this.userRepository.delete(id).then(() => {}); // 유저 삭제
  }

  async findOrCreate(profile: Partial<User>): Promise<User> {
    let user = await this.userRepository.findOne({ where: { kakao_id: profile.kakao_id } });
    if (!user) {
      user = this.userRepository.create(profile);
      user = await this.userRepository.save(user);
    }
    return user;
  }

  findOneByKakaoId(kakaoId: string): Promise<User> {
    return this.userRepository.findOne({ where: { kakao_id: kakaoId } }); // 카카오 ID로 유저 조회
  }
}
