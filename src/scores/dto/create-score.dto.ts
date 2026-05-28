import { IsNumber, IsString } from 'class-validator';

export class CreateScoreDto {
  @IsNumber()
  score: number;

  @IsString()
  userName: string;

  @IsNumber()
  numberOfQuestions: number;

  @IsString()
  typeOfQuiz: string;
}
