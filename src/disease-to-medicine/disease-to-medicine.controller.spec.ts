import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DiseaseToMedicineController } from './disease-to-medicine.controller';
import { DiseaseToMedicineService } from './disease-to-medicine.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiseaseToMedicine } from './entities/disease-to-medicine.entity';
import { FindOneDiseaseToMedicineDto } from './dto/find-one-disease-to-medicine.dto';
import type { CreateDiseaseToMedicineDto } from './dto/create-disease-to-medicine.dto';
import type { UpdateDiseaseToMedicineDto } from './dto/update-disease-to-medicine.dto';
import { NotFoundException } from '@nestjs/common';
import { Disease } from '../diseases/entities/disease.entity';
import { Medicine } from '../medicines/entities/medicine.entity';

describe('DiseaseToMedicinesController', () => {
  let controller: DiseaseToMedicineController;
  let service: DiseaseToMedicineService;
  const mock: DiseaseToMedicine = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    diseaseId: 'e7735747-fbe2-42c3-9c61-c91ddab9951b',
    disease: new Disease(),
    medicineId: '076480d5-39c9-4a72-9dd4-674a1f74fa18',
    medicine: new Medicine(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiseaseToMedicineController],
      providers: [
        DiseaseToMedicineService,
        {
          provide: getRepositoryToken(DiseaseToMedicine),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<DiseaseToMedicineController>(
      DiseaseToMedicineController,
    );
    service = module.get<DiseaseToMedicineService>(DiseaseToMedicineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of DiseaseToMedicines', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of DiseaseToMedicines', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a DiseaseToMedicine when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneDiseaseToMedicineDto =
        new FindOneDiseaseToMedicineDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneDiseaseToMedicineDto =
        new FindOneDiseaseToMedicineDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new DiseaseToMedicine', async () => {
      const dto: CreateDiseaseToMedicineDto = {
        diseaseId: 'e7735747-fbe2-42c3-9c61-c91ddab9951b',
        medicineId: '076480d5-39c9-4a72-9dd4-674a1f74fa18',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a DiseaseToMedicine', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateDiseaseToMedicineDto = {
        diseaseId: 'e7735747-fbe2-42c3-9c61-c91ddab9951b',
        medicineId: '076480d5-39c9-4a72-9dd4-674a1f74fa18',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id: id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a DiseaseToMedicine', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';
      jest.spyOn(service, 'remove').mockResolvedValue(mock);
      const result = await controller.remove({ id });
      expect(result).toEqual(mock);
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      const invalidId = '5f81ae87-8956-4cd4-868e-aec571b6470e';
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove({ id: invalidId })).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
