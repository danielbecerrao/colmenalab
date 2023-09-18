import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateDoctorDto } from './dto/create-doctor.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { UpdateDoctorDto } from './dto/update-doctor.dto';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let repository: Repository<Doctor>;
  const mock: Doctor = {
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
    contractingDate: new Date(),
    profesionalCard: '75456378',
  };
  const createDto: CreateDoctorDto = {
    address: 'Calle 17',
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
    contractingDate: new Date(),
    profesionalCard: '9345749876',
  };
  const updateDto: UpdateDoctorDto = {
    address: 'Calle 17',
    city: 'Pereira',
    email: 'email@e.com',
    firstname: 'Daniel',
    lastname: 'Becerra',
    identification: '7648957',
    phone: '3745468',
    contractingDate: new Date(),
    profesionalCard: '9345749876',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    repository = module.get<Repository<Doctor>>(getRepositoryToken(Doctor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Doctors', async () => {
      const mock: Doctor[] = [new Doctor(), new Doctor()];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });

    it('should return an empty array of Doctors', async () => {
      const mock: Doctor[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Doctor object when a valid id is passed', async () => {
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
    it('should find a doctor by identification', async () => {
      const identification = '1234567890';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      const result = await service.findOneByIdentification(identification);
      expect(result).toEqual(mock);
    });

    it('should return null when no doctor is found', async () => {
      const nonExistentIdentification = '9999999999';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const result = await service.findOneByIdentification(
        nonExistentIdentification,
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new doctor', async () => {
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const result = await service.create(mock);

      expect(result).toEqual(mock);
    });

    it('should throw a ConflictException when a doctor with the same identification already exists', async () => {
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
    it('should update a doctor', async () => {
      const doctorId = '1';
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateDto,
      });
      const result = await service.update(doctorId, updateDto);
      expect(result).toEqual({
        ...mock,
        ...updateDto,
      });
    });

    it('should throw a NotFoundException when updating a non-existent doctor', async () => {
      const nonExistentDoctorId = '5f81ae87-8956-4cd4-868e-aec571b6470e';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(nonExistentDoctorId, updateDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException when updating with an existing identification', async () => {
      const doctorId = '46578678';
      const updateDoctorDto: UpdateDoctorDto = {
        identification: 'newIdentification',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(service, 'findOneByIdentification').mockResolvedValue(mock);
      await expect(
        service.update(doctorId, updateDoctorDto),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a Doctor when a valid ID is provided', async () => {
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
