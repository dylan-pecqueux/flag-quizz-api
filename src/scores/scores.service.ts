import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoresRepository: Repository<Score>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    const score = this.scoresRepository.create(createScoreDto);
    return await this.scoresRepository.save(score);
  }

  async findByNumberOfQuestions(numberOfQuestions: number) {
    return await this.scoresRepository.find({
      where: { numberOfQuestions },
      order: { score: 'DESC' },
    });
  }
}
