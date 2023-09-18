import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { FindOneDoctorDto } from './dto/find-one-doctor.dto';
import type { CreateDoctorDto } from './dto/create-doctor.dto';
import type { UpdateDoctorDto } from './dto/update-doctor.dto';
import { NotFoundException } from '@nestjs/common';

describe('DoctorsController', () => {
  let controller: DoctorsController;
  let service: DoctorsService;
  const mock: Doctor = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    address: 'Calle 345',
    appointments: [],
    city: 'Pereira',
    contractingDate: new Date(),
    email: 'a@w.com',
    firstname: 'Juan',
    lastname: 'Gomez',
    identification: '73458',
    phone: '75486',
    profesionalCard: '8734468',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorsController],
      providers: [
        DoctorsService,
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<DoctorsController>(DoctorsController);
    service = module.get<DoctorsService>(DoctorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Doctors', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Doctors', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Doctor when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneDoctorDto = new FindOneDoctorDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneDoctorDto = new FindOneDoctorDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new Doctor', async () => {
      const dto: CreateDoctorDto = {
        address: 'Calle 345',
        city: 'Pereira',
        contractingDate: new Date(),
        email: 'a@w.com',
        firstname: 'Juan',
        lastname: 'Gomez',
        identification: '73458',
        phone: '75486',
        profesionalCard: '8734468',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a Doctor', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateDoctorDto = {
        address: 'Calle 345',
        city: 'Pereira',
        contractingDate: new Date(),
        email: 'a@w.com',
        firstname: 'Juan',
        lastname: 'Gomez',
        identification: '73458',
        phone: '75486',
        profesionalCard: '8734468',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a Doctor', async () => {
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
