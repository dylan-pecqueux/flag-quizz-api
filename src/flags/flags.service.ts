import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flag } from './entities/flag.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { FlagModel } from './models/flag.model';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(Flag)
    private readonly flagRepository: Repository<Flag>,
  ) {}

  private readonly FLAG_BASE_URL = 'https://flagcdn.com';

  async create(createFlagDto: CreateFlagDto): Promise<FlagModel> {
    const flag = this.flagRepository.create(createFlagDto);
    try {
      const saved = await this.flagRepository.save(flag);
      return this.toModel(saved);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          `Flag with countryCode "${createFlagDto.countryCode}" already exists`,
        );
      }
      throw err;
    }
  }

  async findAll(): Promise<FlagModel[]> {
    const flags = await this.flagRepository.find();
    return flags.map((flag) => this.toModel(flag));
  }

  async findOne(id: number): Promise<FlagModel> {
    const flag = await this.flagRepository.findOne({ where: { id } });
    if (!flag) throw new NotFoundException('Flag not found');
    return this.toModel(flag);
  }

  async remove(id: number): Promise<void> {
    const result = await this.flagRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Flag not found');
  }

  private toModel(flag: Flag): FlagModel {
    return {
      ...flag,
      flagUrl: this.getFlagUrlByCountryCode(flag.countryCode),
    };
  }

  private getFlagUrlByCountryCode(countryCode: string): string {
    return `${this.FLAG_BASE_URL}/w640/${countryCode.toLowerCase()}.png`;
  }
}
