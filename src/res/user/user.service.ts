import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /*findAll(): Promise<User[]> {
    return this.UserRepository.find();
  }*/

  // view user
  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // find or create user
  async findOrCreate(userData: { kakao_id: number; nickname: string }): Promise<User> {
    let user = await this.userRepository.findOne({ where: { kakao_id: userData.kakao_id } });
    if (!user) {
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }
    return user;
  }

  // create user
  create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // update user
  async update(id: number, user: Partial<User>): Promise<void> {
    await this.userRepository.update(id, user);
  }

  // remove user
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}