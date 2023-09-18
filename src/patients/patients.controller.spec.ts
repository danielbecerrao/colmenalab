import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { FindOnePatientDto } from './dto/find-one-patient.dto';
import type { CreatePatientDto } from './dto/create-patient.dto';
import type { UpdatePatientDto } from './dto/update-patient.dto';
import { NotFoundException } from '@nestjs/common';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;
  const mock: Patient = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    address: 'Calle 17',
    appointments: [],
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Patients', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Patients', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Patient when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOnePatientDto = new FindOnePatientDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOnePatientDto = new FindOnePatientDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new Patient', async () => {
      const dto: CreatePatientDto = {
        address: 'Calle 17',
        city: 'Pereira',
        email: 'email@e.com',
        firstname: 'Daniel',
        lastname: 'Becerra',
        identification: '7648957',
        phone: '3745468',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a Patient', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdatePatientDto = {
        address: 'Calle 17',
        city: 'Pereira',
        email: 'email@e.com',
        firstname: 'Daniel',
        lastname: 'Becerra',
        identification: '7648957',
        phone: '3745468',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a Patient', async () => {
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
