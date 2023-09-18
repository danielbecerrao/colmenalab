import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Status } from './enums/status.enum';
import { FindOneAppointmentDto } from './dto/find-one-appointment.dto';
import type { CreateAppointmentDto } from './dto/create-appointment.dto';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { NotFoundException } from '@nestjs/common';
import type { FindAppointmentsDto } from './dto/find-appointments.dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mock: Appointment = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    patientId: '076480d5-39c9-4a72-9dd4-674a1f74fa18',
    patient: new Patient(),
    doctorId: 'fe863990-5b5a-4db1-aaab-c1d296fd325a',
    doctor: new Doctor(),
    date: new Date(),
    scheduleId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
    schedule: new Schedule(),
    status: Status.Programada,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    orders: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        AppointmentsService,
        DoctorsService,
        PatientsService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Appointments', async () => {
      const mock = [new Appointment(), new Appointment()];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });

    it('should return an empty array of Appointments', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Appointment when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneAppointmentDto = new FindOneAppointmentDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneAppointmentDto = new FindOneAppointmentDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('findByIdentificationOrDate', () => {
    it('should call AppointmentsService.findByIdentificationOrDate with correct parameters', async () => {
      const findAppointmentsDto: FindAppointmentsDto = {
        patientIdentification: '234345435',
        doctorIdentification: '5435435',
        date: new Date(),
      };

      const appointmentsResult: Appointment[] = [];

      const findByIdentificationOrDateSpy = jest
        .spyOn(service, 'findByIdentificationOrDate')
        .mockResolvedValue(appointmentsResult);

      const result =
        await controller.findByIdentificationOrDate(findAppointmentsDto);

      expect(findByIdentificationOrDateSpy).toHaveBeenCalledWith(
        findAppointmentsDto.patientIdentification,
        findAppointmentsDto.doctorIdentification,
        findAppointmentsDto.date,
      );
      expect(result).toEqual(appointmentsResult);
    });
  });

  describe('create', () => {
    it('should create a new Appointment', async () => {
      const dto: CreateAppointmentDto = {
        patientIdentification: '2357734985',
        doctorIdentification: 'fe863990-5b5a-4db1-aaab-c1d296fd325a',
        date: new Date(),
        scheduleId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a Appointment', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateAppointmentDto = {
        patientIdentification: '2357734985',
        doctorIdentification: 'fe863990-5b5a-4db1-aaab-c1d296fd325a',
        date: new Date(),
        scheduleId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
        status: Status.Asistio,
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a Appointment', async () => {
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
