import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }

  @Get()
  findAll(@Query('numberOfQuestions', ParseIntPipe) numberOfQuestions: number) {
    return this.scoresService.findByNumberOfQuestions(numberOfQuestions);
  }
}
