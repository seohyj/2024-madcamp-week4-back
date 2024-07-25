import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateUserMylogDto {
    @IsInt()
    kakao_id: string;

    @IsDateString()
    date: string;

    @IsString()
    title: string;

    @IsString()
    context: string;
}

/* JSON
{
  "kakao_id": number,
  "date": "YYYY-MM-DD",
  "title": "일기 제목",
  "context": "일기 본문"
}
*/