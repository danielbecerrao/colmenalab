import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DiseasesService } from './diseases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Repository } from 'typeorm';
import type { CreateDiseaseDto } from './dto/create-disease.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { UpdateDiseaseDto } from './dto/update-disease.dto';

describe('DiseasesService', () => {
  let service: DiseasesService;
  let repository: Repository<Disease>;
  const mock: Disease = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    name: 'Sample Disease',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    diseaseToMedicine: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiseasesService,
        {
          provide: getRepositoryToken(Disease),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiseasesService>(DiseasesService);
    repository = module.get<Repository<Disease>>(getRepositoryToken(Disease));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Diseases', async () => {
      const mocks: Disease[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Diseases', async () => {
      const mocks: Disease[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });
  });

  describe('findOne', () => {
    it('should return a Disease object when a valid id is passed', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);

      const id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await service.findOne(id);

      expect(result).toEqual(mock);
    });

    it('should return null when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new Disease', async () => {
      const createDiseaseDto: CreateDiseaseDto = {
        name: 'gripe',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);
      const result = await service.create(createDiseaseDto);
      expect(result).toEqual(mock);
    });

    it('should throw a ConflictException when a Disease with the same name already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      await expect(service.create(mock)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a Disease when valid data is provided', async () => {
      const updateDiseaseDto: UpdateDiseaseDto = {
        name: 'Updated gripe',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateDiseaseDto,
      });

      const result = await service.update(
        'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
        updateDiseaseDto,
      );

      expect(result).toEqual({
        ...mock,
        ...updateDiseaseDto,
      });
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const updateDiseaseDto: UpdateDiseaseDto = {
        name: 'Updated gripe',
      };
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59d',
          updateDiseaseDto,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException when a Disease with the same name already exists', async () => {
      const updateDiseaseDto: UpdateDiseaseDto = {
        name: 'Updated gripe',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(mock);
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
          updateDiseaseDto,
        ),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a Disease when a valid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(repository, 'softRemove').mockResolvedValue(mock);

      const result = await service.remove(
        'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
      );

      expect(result).toEqual(mock);
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove('invalidId')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
