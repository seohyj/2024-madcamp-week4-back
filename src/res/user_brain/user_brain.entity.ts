import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserBrain {
  @PrimaryColumn()
  kakao_id: number;

  @PrimaryColumn()
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