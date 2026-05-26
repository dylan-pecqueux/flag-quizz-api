import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { FlagsService } from './flags.service';
import { Flag } from './entities/flag.entity';

type MockRepo = Partial<Record<keyof Repository<Flag>, jest.Mock>>;

const makeRepo = (): MockRepo => ({
  create: jest.fn((dto: Partial<Flag>) => dto as Flag),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('FlagsService', () => {
  let service: FlagsService;
  let repo: MockRepo;

  beforeEach(async () => {
    repo = makeRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        { provide: getRepositoryToken(Flag), useValue: repo },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('returns a FlagModel with a derived flagUrl', async () => {
      repo.findOne!.mockResolvedValue({
        id: 1,
        country: 'France',
        countryCode: 'FR',
        description: null,
      });

      await expect(service.findOne(1)).resolves.toEqual({
        id: 1,
        country: 'France',
        countryCode: 'FR',
        description: null,
        flagUrl: 'https://flagcdn.com/w640/fr.png',
      });
    });

    it('throws NotFoundException when the flag is missing', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(42)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('maps the saved entity to a FlagModel', async () => {
      repo.save!.mockResolvedValue({
        id: 1,
        country: 'France',
        countryCode: 'FR',
        description: null,
      });

      await expect(
        service.create({
          country: 'France',
          countryCode: 'FR',
          description: null as unknown as string,
        }),
      ).resolves.toMatchObject({
        flagUrl: 'https://flagcdn.com/w640/fr.png',
      });
    });

    it('translates a unique-violation into a 409 ConflictException', async () => {
      const err = new QueryFailedError('insert', [], new Error('dup'));
      (err as QueryFailedError & { code?: string }).code = '23505';
      repo.save!.mockRejectedValue(err);

      await expect(
        service.create({
          country: 'France',
          countryCode: 'FR',
          description: null as unknown as string,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when no row is affected', async () => {
      repo.delete!.mockResolvedValue({ affected: 0 });
      await expect(service.remove(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
