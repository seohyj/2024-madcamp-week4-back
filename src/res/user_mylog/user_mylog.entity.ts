import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMylog {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'bigint' })
  kakao_id: string; // TypeORM에서는 bigint를 string으로 매핑

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp', nullable: true })
  sleep_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  wake_time: Date;

  @Column()
  title: string;

  @Column()
  context: string;

  @Column({ type: 'float', nullable: true })
  hex_happy: number;

  @Column({ type: 'float', nullable: true })
  hex_sad: number;

  @Column({ type: 'float', nullable: true })
  hex_anger: number;

  @Column({ type: 'float', nullable: true })
  hex_fear: number;

  @Column({ type: 'float', nullable: true })
  hex_surprise: number;

  @Column({ type: 'float', nullable: true })
  hex_disgust: number;
}