import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint' })
    kakao_id: string; // TypeORM에서는 bigint를 string으로 매핑

    @Column()
    nickname: string;
}
