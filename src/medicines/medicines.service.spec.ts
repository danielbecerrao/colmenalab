import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MedicinesService } from './medicines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { Repository } from 'typeorm';
import type { CreateMedicineDto } from './dto/create-medicine.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { UpdateMedicineDto } from './dto/update-medicine.dto';

describe('MedicinesService', () => {
  let service: MedicinesService;
  let repository: Repository<Medicine>;
  const mock: Medicine = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    name: 'Sample Medicine',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    diseaseToMedicine: [],
    orderToMedicine: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicinesService,
        {
          provide: getRepositoryToken(Medicine),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MedicinesService>(MedicinesService);
    repository = module.get<Repository<Medicine>>(getRepositoryToken(Medicine));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Medicines', async () => {
      const mocks: Medicine[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Medicines', async () => {
      const mocks: Medicine[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });
  });

  describe('findOne', () => {
    it('should return a Medicine object when a valid id is passed', async () => {
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
    it('should create a new Medicine', async () => {
      const createMedicineDto: CreateMedicineDto = {
        name: 'acetaminophen',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);
      const result = await service.create(createMedicineDto);
      expect(result).toEqual(mock);
    });

    it('should throw a ConflictException when a Medicine with the same name already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      await expect(service.create(mock)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a Medicine when valid data is provided', async () => {
      const updateMedicineDto: UpdateMedicineDto = {
        name: 'Updated acetaminophen',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateMedicineDto,
      });

      const result = await service.update(
        'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
        updateMedicineDto,
      );

      expect(result).toEqual({
        ...mock,
        ...updateMedicineDto,
      });
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const updateMedicineDto: UpdateMedicineDto = {
        name: 'Updated acetaminophen',
      };
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59d',
          updateMedicineDto,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException when a medicine with the same name already exists', async () => {
      const updateMedicineDto: UpdateMedicineDto = {
        name: 'Updated acetaminophen',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByName').mockResolvedValue(mock);
      await expect(
        service.update(
          'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
          updateMedicineDto,
        ),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a Medicine when a valid ID is provided', async () => {
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
