import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiTags } from '@nestjs/swagger';
import type { Patient } from './entities/patient.entity';
import { FindOneUuidPatientDto } from './dto/find-one-uuid-patient.dto';

@Controller('patients')
@ApiTags('Pacientes')
export class PatientsController {
  public constructor(private readonly patientsService: PatientsService) {}

  @Post()
  public async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  public async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param() findOneUuidPatientDto: FindOneUuidPatientDto,
  ): Promise<Patient | null> {
    return this.patientsService.findOne(findOneUuidPatientDto.id);
  }

  @Patch(':id')
  public async update(
    @Param() findOneUuidPatientDto: FindOneUuidPatientDto,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.update(
      findOneUuidPatientDto.id,
      updatePatientDto,
    );
  }

  @Delete(':id')
  public async remove(
    @Param() findOneUuidPatientDto: FindOneUuidPatientDto,
  ): Promise<Patient> {
    return this.patientsService.remove(findOneUuidPatientDto.id);
  }
}
