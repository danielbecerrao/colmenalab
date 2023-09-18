import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiTags } from '@nestjs/swagger';
import type { Doctor } from './entities/doctor.entity';
import { FindOneDoctorDto } from './dto/find-one-doctor.dto';

@Controller('doctors')
@ApiTags('Médicos')
export class DoctorsController {
  public constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  public async create(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  public async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param() findOneUuidDoctorDto: FindOneDoctorDto,
  ): Promise<Doctor | null> {
    return this.doctorsService.findOne(findOneUuidDoctorDto.id);
  }

  @Patch(':id')
  public async update(
    @Param() findOneUuidDoctorDto: FindOneDoctorDto,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.update(findOneUuidDoctorDto.id, updateDoctorDto);
  }

  @Delete(':id')
  public async remove(
    @Param() findOneUuidDoctorDto: FindOneDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.remove(findOneUuidDoctorDto.id);
  }
}
