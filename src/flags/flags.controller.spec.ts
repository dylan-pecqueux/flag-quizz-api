import { Test, TestingModule } from '@nestjs/testing';
import { FlagsController } from './flags.controller';
import { FlagsService } from './flags.service';

describe('FlagsController', () => {
  let controller: FlagsController;
  let service: jest.Mocked<
    Pick<FlagsService, 'findAll' | 'findOne' | 'create' | 'remove'>
  >;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [{ provide: FlagsService, useValue: service }],
    }).compile();

    controller = module.get<FlagsController>(FlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates findOne to the service', async () => {
    const flag = {
      id: 1,
      country: 'France',
      countryCode: 'FR',
      description: null as unknown as string,
      flagUrl: 'https://flagcdn.com/w640/fr.png',
    };
    service.findOne.mockResolvedValue(flag);

    await expect(controller.findOne(1)).resolves.toEqual(flag);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });
});
