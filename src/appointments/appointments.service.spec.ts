import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Status } from './enums/status.enum';
import type { CreateAppointmentDto } from './dto/create-appointment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: Repository<Appointment>;
  let doctorsService: DoctorsService;
  let patientsService: PatientsService;

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

  const createAppointmentDto: CreateAppointmentDto = {
    doctorIdentification: 'doctor123',
    patientIdentification: 'patient456',
    date: new Date('2023-09-17'),
    scheduleId: 'schedule789',
  };

  const updateAppointmentDto: UpdateAppointmentDto = {
    doctorIdentification: 'doctor123',
    patientIdentification: 'patient456',
    date: new Date('2023-09-17'),
    scheduleId: 'schedule789',
    status: Status.Asistio,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    doctorsService = module.get<DoctorsService>(DoctorsService);
    patientsService = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('doctorAvailability', () => {
    it('should return true when there is no appointment for the given doctor, date, and schedule', async () => {
      const doctorId = '3253434';
      const date = new Date('2023-09-17');
      const scheduleId = '14b8bbed-259b-4787-ad11-7de940815d28';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.doctorAvailability(
        doctorId,
        date,
        scheduleId,
      );

      expect(result).toBe(true);
    });

    it('should return false when there is an appointment for the given doctor, date, and schedule', async () => {
      const doctorIdentification = 'doctor123';
      const date = new Date('2023-09-17');
      const scheduleId = 'schedule456';

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const result = await service.doctorAvailability(
        doctorIdentification,
        date,
        scheduleId,
      );

      expect(result).toBe(false);
    });
  });

  describe('patientAvailability', () => {
    it('should return true when there is no appointment for the given patient, date, and schedule', async () => {
      const patientIdentification = '3253434';
      const date = new Date('2023-09-17');
      const scheduleId = '14b8bbed-259b-4787-ad11-7de940815d28';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.patientAvailability(
        patientIdentification,
        date,
        scheduleId,
      );

      expect(result).toBe(true);
    });

    it('should return false when there is an appointment for the given patient, date, and schedule', async () => {
      const patientId = 'doctor123';
      const date = new Date('2023-09-17');
      const scheduleId = 'schedule456';

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const result = await service.doctorAvailability(
        patientId,
        date,
        scheduleId,
      );

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return an array of Appointments', async () => {
      const mock: Appointment[] = [new Appointment(), new Appointment()];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });

    it('should return an empty array of Appointments', async () => {
      const mock: Appointment[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Appointment object when a valid id is passed', async () => {
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
    it('should create a new appointment', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest.spyOn(service, 'doctorAvailability').mockResolvedValue(true);
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(new Patient());
      jest.spyOn(service, 'patientAvailability').mockResolvedValue(true);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const result = await service.create(createAppointmentDto);

      expect(result).toEqual(mock);
    });

    it('should throw a NotFoundException when doctor is not found', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(null);

      await expect(service.create(createAppointmentDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException when patient is not found', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.create(createAppointmentDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException when doctor is not available', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest.spyOn(service, 'doctorAvailability').mockResolvedValue(false);
      await expect(service.create(createAppointmentDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException when patient is not available', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest.spyOn(service, 'doctorAvailability').mockResolvedValue(true);
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(new Patient());
      jest.spyOn(service, 'patientAvailability').mockResolvedValue(false);

      await expect(service.create(createAppointmentDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException when there is a server error during creation', async () => {
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest.spyOn(service, 'doctorAvailability').mockResolvedValue(true);
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(new Patient());
      jest.spyOn(service, 'patientAvailability').mockResolvedValue(true);

      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Error de servidor'));

      await expect(service.create(createAppointmentDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const appointmentId = '46d9b57a-4f6a-49c0-a830-90fd4959cf69';
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(new Patient());
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateAppointmentDto,
      });

      const result = await service.update(appointmentId, updateAppointmentDto);

      expect(result).toEqual({
        ...mock,
        ...updateAppointmentDto,
      });
    });

    it('should throw a NotFoundException when updating a non-existent appointment', async () => {
      const nonExistentAppointmentId = '999';

      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(null);
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(null);
      await expect(
        service.update(nonExistentAppointmentId, updateAppointmentDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException when doctor is not found', async () => {
      const appointmentId = '46d9b57a-4f6a-49c0-a830-90fd4959cf69';

      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(null);

      await expect(
        service.update(appointmentId, updateAppointmentDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException when patient is not found', async () => {
      const appointmentId = '1';

      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(null);

      await expect(
        service.update(appointmentId, updateAppointmentDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a BadRequestException when there is a server error during update', async () => {
      const appointmentId = '1';

      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(doctorsService, 'findOneByIdentification')
        .mockResolvedValue(new Doctor());
      jest
        .spyOn(patientsService, 'findOneByIdentification')
        .mockResolvedValue(new Patient());

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new BadRequestException());

      await expect(
        service.update(appointmentId, updateAppointmentDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a Appointment when a valid ID is provided', async () => {
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
