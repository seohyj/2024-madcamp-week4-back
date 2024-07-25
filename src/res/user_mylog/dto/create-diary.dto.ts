import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateDiaryDto {
    @IsInt()
    kakao_id: string;

    @IsDateString()
    date: string;

    @IsString()
    title: string;

    @IsString()
    context: string;
}

