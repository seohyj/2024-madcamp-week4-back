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

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } }); // ID로 유저 조회
  }

  create(user: User): Promise<User> {
    return this.userRepository.save(user); // 유저 생성 및 저장
  }

  update(id: number, user: Partial<User>): Promise<void> {
    return this.userRepository.update(id, user).then(() => {}); // 유저 업데이트
  }

  remove(id: number): Promise<void> {
    return this.userRepository.delete(id).then(() => {}); // 유저 삭제
  }

  findOrCreate(user: Partial<User>): Promise<User> {
    return this.userRepository.findOne({ where: { kakao_id: user.kakao_id } }).then(existingUser => {
      if (existingUser) {
        return existingUser; // 유저가 이미 존재하면 해당 유저 반환
      }
      return this.userRepository.save(user); // 존재하지 않으면 유저 생성 및 저장
    });
  }

  findOneByKakaoId(kakaoId: number): Promise<User> {
    return this.userRepository.findOne({ where: { kakao_id: kakaoId } }); // 카카오 ID로 유저 조회
  }
}
