import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { FindOneSpecialtyDto } from './dto/find-one-specialty.dto';
import type { CreateSpecialtyDto } from './dto/create-specialty.dto';
import type { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { NotFoundException } from '@nestjs/common';

describe('SpecialtiesController', () => {
  let controller: SpecialtiesController;
  let service: SpecialtiesService;
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
      controllers: [SpecialtiesController],
      providers: [
        SpecialtiesService,
        {
          provide: getRepositoryToken(Specialty),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<SpecialtiesController>(SpecialtiesController);
    service = module.get<SpecialtiesService>(SpecialtiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Specialties', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Specialties', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Specialty when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneSpecialtyDto = new FindOneSpecialtyDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneSpecialtyDto = new FindOneSpecialtyDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new specialty', async () => {
      const dto: CreateSpecialtyDto = {
        name: 'Dermatology',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a specialty', async () => {
      const specialtyId = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateSpecialtyDto = {
        name: 'Updated Dermatology',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id: specialtyId }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a specialty', async () => {
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
