import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DiseaseToMedicineService } from './disease-to-medicine.service';
import { DiseaseToMedicine } from './entities/disease-to-medicine.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from '../medicines/entities/medicine.entity';
import type { CreateDiseaseToMedicineDto } from './dto/create-disease-to-medicine.dto';
import type { UpdateDiseaseToMedicineDto } from './dto/update-disease-to-medicine.dto';
import { NotFoundException } from '@nestjs/common';
import { Disease } from '../diseases/entities/disease.entity';

describe('DiseaseToMedicineService', () => {
  let service: DiseaseToMedicineService;
  let repository: Repository<DiseaseToMedicine>;
  const mock: DiseaseToMedicine = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    diseaseId: '14b8bbed-259b-4787-ad11-7de940815d28',
    disease: new Disease(),
    medicine: new Medicine(),
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  const createDto: CreateDiseaseToMedicineDto = {
    diseaseId: '14b8bbed-259b-4787-ad11-7de940815d28',
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
  };
  const updateDto: UpdateDiseaseToMedicineDto = {
    diseaseId: '14b8bbed-259b-4787-ad11-7de940815d28',
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiseaseToMedicineService,
        {
          provide: getRepositoryToken(DiseaseToMedicine),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiseaseToMedicineService>(DiseaseToMedicineService);
    repository = module.get<Repository<DiseaseToMedicine>>(
      getRepositoryToken(DiseaseToMedicine),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of DiseaseToMedicine', async () => {
      const mocks: DiseaseToMedicine[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of DiseaseToMedicine', async () => {
      const mock: DiseaseToMedicine[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a DiseaseToMedicine object when a valid id is passed', async () => {
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
    it('should create a new DiseaseToMedicine', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);
      const result = await service.create(createDto);
      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update an DiseaseToMedicine', async () => {
      const orderId = '14b8bbed-259b-4787-ad11-7de940815d28';
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateDto,
      });
      const result = await service.update(orderId, updateDto);
      expect(result).toEqual({
        ...mock,
        ...updateDto,
      });
    });

    it('should throw a NotFoundException when updating a non-existent DiseaseToMedicine', async () => {
      const nonExistentOrderId = '14b8bbed-259b-4787-ad11-7de940815d56';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(nonExistentOrderId, updateDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a DiseaseToMedicine when a valid ID is provided', async () => {
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
