import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBrain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  kakao_id: string; // TypeORM에서는 bigint를 string으로 매핑

  @Column()
  date: Date;

  @Column()
  frontal_stroop_accuracy: number;

  @Column()
  frontal_stroop_num: number;

  @Column()
  frontal_ds: number;

  @Column()
  hippo: number;

  @Column()
  medial: number;
}