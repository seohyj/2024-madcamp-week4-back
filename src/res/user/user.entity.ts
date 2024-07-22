import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number; // 자동 증가되는 primary key

  @Column({ unique: true })
  kakao_id: number; // 카카오에서 제공하는 고유 ID, 유니크하게 설정

  @Column()
  nickname: string; // 사용자 닉네임
}
