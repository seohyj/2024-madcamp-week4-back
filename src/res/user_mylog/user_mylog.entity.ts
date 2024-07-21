import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMylog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kakao_id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'timestamp' })
  sleep_time: Date;

  @Column({ type: 'timestamp' })
  wake_time: Date;

  @Column()
  title: string;

  @Column()
  context: string;

  @Column()
  hex_happy: number;

  @Column()
  hex_sad: number;

  @Column()
  hex_anger: number;

  @Column()
  hex_fear: number;

  @Column()
  hex_surprise: number;

  @Column()
  hex_disgust: number;
}
