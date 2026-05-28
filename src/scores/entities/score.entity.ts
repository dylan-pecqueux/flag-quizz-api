import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'number_of_questions' })
  numberOfQuestions: number;

  @Column({ name: 'type_of_quiz' })
  typeOfQuiz: string;
}
