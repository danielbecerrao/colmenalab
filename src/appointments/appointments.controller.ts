import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import type { Appointment } from './entities/appointment.entity';
import { ApiTags } from '@nestjs/swagger';
import { FindOneAppointmentDto } from './dto/find-one-appointment.dto';
import { FindAppointmentsDto } from './dto/find-appointments.dto';

@Controller('appointments')
@ApiTags('Citas')
export class AppointmentsController {
  public constructor(
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Post()
  public async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  public async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('find')
  public async findByIdentificationOrDate(
    @Query() findAppointmentsDto: FindAppointmentsDto,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByIdentificationOrDate(
      findAppointmentsDto.patientIdentification,
      findAppointmentsDto.doctorIdentification,
      findAppointmentsDto.date,
    );
  }

  @Get(':id')
  public async findOne(
    @Param() findOneUuidAppointmentDto: FindOneAppointmentDto,
  ): Promise<Appointment | null> {
    return this.appointmentsService.findOne(findOneUuidAppointmentDto.id);
  }

  @Patch(':id')
  public async update(
    @Param() findOneUuidAppointmentDto: FindOneAppointmentDto,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(
      findOneUuidAppointmentDto.id,
      updateAppointmentDto,
    );
  }

  @Delete(':id')
  public async remove(
    @Param() findOneUuidAppointmentDto: FindOneAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.remove(findOneUuidAppointmentDto.id);
  }
}
