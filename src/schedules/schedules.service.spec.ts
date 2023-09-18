import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let repository: Repository<Schedule>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    repository = module.get<Repository<Schedule>>(getRepositoryToken(Schedule));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of Schedules', async () => {
      const mock: Schedule[] = [new Schedule(), new Schedule()];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });

    it('should return an empty array of Schedules', async () => {
      const mock: Schedule[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });
});
