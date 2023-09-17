import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateAppointmentDto } from './dto/create-appointment.dto';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import type { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import type { Doctor } from 'src/doctors/entities/doctor.entity';
import type { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class AppointmentsService {
  public constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  private async doctorAvailability(
    doctorId: string,
    date: Date,
    scheduleId: string,
  ): Promise<boolean> {
    const appointment: Appointment | null =
      await this.appointmentRepository.findOne({
        where: {
          doctorId,
          date,
          scheduleId,
        },
      });
    return !appointment;
  }

  private async patientAvailability(
    patientId: string,
    date: Date,
    scheduleId: string,
  ): Promise<boolean> {
    const appointment: Appointment | null =
      await this.appointmentRepository.findOne({
        where: {
          patientId,
          date,
          scheduleId,
        },
      });
    return !appointment;
  }

  public async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const doctor: Doctor | null =
      await this.doctorsService.findOneByIdentification(
        createAppointmentDto.doctorIdentification,
      );
    if (!doctor) {
      throw new NotFoundException('Error al crear cita', {
        cause: new Error(),
        description: 'Doctor no encontrado por identificación',
      });
    }
    const doctorAvailability: boolean = await this.doctorAvailability(
      doctor.id,
      createAppointmentDto.date,
      createAppointmentDto.scheduleId,
    );
    if (!doctorAvailability) {
      throw new NotFoundException('Error al crear cita', {
        cause: new Error(),
        description: 'Doctor no disponible para la fecha y hora',
      });
    }
    const patient: Patient | null =
      await this.patientsService.findOneByIdentification(
        createAppointmentDto.patientIdentification,
      );
    if (!patient) {
      throw new NotFoundException('Error al crear cita', {
        cause: new Error(),
        description: 'Paciente no encontrado por identificación',
      });
    }
    const patientAvailability: boolean = await this.patientAvailability(
      patient.id,
      createAppointmentDto.date,
      createAppointmentDto.scheduleId,
    );
    if (!patientAvailability) {
      throw new NotFoundException('Error al crear cita', {
        cause: new Error(),
        description: 'Paciente no disponible para la fecha y hora',
      });
    }
    try {
      const appointment: Appointment =
        this.appointmentRepository.create(createAppointmentDto);
      appointment.doctorId = doctor.id;
      appointment.patientId = patient.id;
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      throw new BadRequestException('Error al crear la cita', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['doctor', 'patient', 'schedule'],
    });
  }

  public async findOne(id: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOneBy({ id });
  }

  public async findByIdentificationOrDate(
    patientIdentification?: string,
    doctorIdentification?: string,
    date?: Date,
  ): Promise<Appointment[]> {
    const appointment: SelectQueryBuilder<Appointment> =
      this.appointmentRepository
        .createQueryBuilder('appointments')
        .innerJoinAndSelect('appointments.patient', 'patient')
        .innerJoinAndSelect('appointments.doctor', 'doctor')
        .innerJoinAndSelect('appointments.schedule', 'schedule');
    if (patientIdentification)
      appointment.where('patient.identification = :patientIdentification', {
        patientIdentification,
      });
    if (doctorIdentification)
      appointment.where('doctor.identification = :doctorIdentification', {
        doctorIdentification,
      });
    if (date) {
      appointment.where('appointments.date >= :date', {
        date,
      });
    }
    return appointment.getMany();
  }

  public async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    if (updateAppointmentDto.doctorIdentification) {
      const doctor: Doctor | null =
        await this.doctorsService.findOneByIdentification(
          updateAppointmentDto.doctorIdentification,
        );
      if (!doctor) {
        throw new NotFoundException('Error al editar cita', {
          cause: new Error(),
          description: 'Doctor no encontrado por identificación',
        });
      }
    }
    if (updateAppointmentDto.patientIdentification) {
      const patient: Patient | null =
        await this.patientsService.findOneByIdentification(
          updateAppointmentDto.patientIdentification,
        );
      if (!patient) {
        throw new NotFoundException('Error al editar cita', {
          cause: new Error(),
          description: 'Paciente no encontrado por identificación',
        });
      }
    }
    const appointment: Appointment | null = await this.findOne(id);
    if (!appointment)
      throw new NotFoundException('Error al editar cita', {
        cause: new Error(),
        description: 'Cita no encontrada por id',
      });
    try {
      return this.appointmentRepository.save(
        Object.assign(appointment, updateAppointmentDto),
      );
    } catch (error) {
      throw new BadRequestException('Error al editar la cita', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async remove(id: string): Promise<Appointment> {
    const appointment: Appointment | null = await this.findOne(id);
    if (!appointment)
      throw new NotFoundException('Error al eliminar cita', {
        cause: new Error(),
        description: 'Paciente no encontrado por id',
      });
    return this.appointmentRepository.softRemove(appointment);
  }
}
