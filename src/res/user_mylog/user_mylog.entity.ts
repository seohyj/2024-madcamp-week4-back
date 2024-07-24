import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMylog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kakao_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp', nullable: true })
  sleep_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  wake_time: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
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