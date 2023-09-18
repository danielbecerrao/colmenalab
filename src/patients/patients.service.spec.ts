import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreatePatientDto } from './dto/create-patient.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { UpdatePatientDto } from './dto/update-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: Repository<Patient>;
  const mock: Patient = {
    address: 'Calle 17',
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    id: '5f81ae87-8956-4cd4-868e-aec571b6470e',
  };
  const createDto: CreatePatientDto = {
    address: 'Calle 17',
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
  };
  const updateDto: UpdatePatientDto = {
    address: 'Calle 17',
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Patients', async () => {
      const mock: Patient[] = [new Patient(), new Patient()];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });

    it('should return an empty array of Patients', async () => {
      const mock: Patient[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Patient object when a valid id is passed', async () => {
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

  describe('findOneByIdentification', () => {
    it('should find a patient by identification', async () => {
      const identification = '1234567890';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      const result = await service.findOneByIdentification(identification);
      expect(result).toEqual(mock);
    });

    it('should return null when no patient is found', async () => {
      const nonExistentIdentification = '9999999999';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const result = await service.findOneByIdentification(
        nonExistentIdentification,
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const result = await service.create(mock);

      expect(result).toEqual(mock);
    });

    it('should throw a ConflictException when a patient with the same identification already exists', async () => {
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(mock);
      await expect(service.create(createDto)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should throw a BadRequestException when there is a server error during creation', async () => {
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Error de servidor'));
      await expect(service.create(createDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const patientId = '1';
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateDto,
      });
      const result = await service.update(patientId, updateDto);
      expect(result).toEqual({
        ...mock,
        ...updateDto,
      });
    });

    it('should throw a NotFoundException when updating a non-existent patient', async () => {
      const nonExistentPatientId = '5f81ae87-8956-4cd4-868e-aec571b6470e';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(nonExistentPatientId, updateDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException when updating with an existing identification', async () => {
      const patientId = '46578678';
      const updatePatientDto: UpdatePatientDto = {
        identification: 'newIdentification',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(mock);
      await expect(
        service.update(patientId, updatePatientDto),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a Patient when a valid ID is provided', async () => {
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
