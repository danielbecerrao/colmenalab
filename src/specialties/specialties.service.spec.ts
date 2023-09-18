import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SpecialtiesService } from './specialties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Repository } from 'typeorm';
import type { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { UpdateSpecialtyDto } from './dto/update-specialty.dto';

describe('SpecialtiesService', () => {
  let service: SpecialtiesService;
  let repository: Repository<Specialty>;
  const mock: Specialty = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    name: 'Sample Specialty',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    orders: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialtiesService,
        {
          provide: getRepositoryToken(Specialty),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SpecialtiesService>(SpecialtiesService);
    repository = module.get<Repository<Specialty>>(
      getRepositoryToken(Specialty),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Specialties', async () => {
      const mocks: Specialty[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Specialties', async () => {
      const mocks: Specialty[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });
  });

  describe('findOne', () => {
    it('should return a Specialty object when a valid id is passed', async () => {
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
    it('should create a new specialty', async () => {
      const createSpecialtyDto: CreateSpecialtyDto = {
        name: 'Dermatology',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);
      const result = await service.create(createSpecialtyDto);
      expect(result).toEqual(mock);
    });

    it('should throw a ConflictException when a specialty with the same name already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      await expect(service.create(mock)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a specialty when valid data is provided', async () => {
      const updateSpecialtyDto: UpdateSpecialtyDto = {
        name: 'Updated Dermatology',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateSpecialtyDto,
      });

      const result = await service.update(
        'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
        updateSpecialtyDto,
      );

      expect(result).toEqual({
        ...mock,
        ...updateSpecialtyDto,
      });
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const updateSpecialtyDto: UpdateSpecialtyDto = {
        name: 'Updated Dermatology',
      };
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59d',
          updateSpecialtyDto,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException when a specialty with the same name already exists', async () => {
      const updateSpecialtyDto: UpdateSpecialtyDto = {
        name: 'Updated Dermatology',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(mock);
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
          updateSpecialtyDto,
        ),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a specialty when a valid ID is provided', async () => {
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
