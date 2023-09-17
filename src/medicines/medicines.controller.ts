import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import type { Medicine } from './entities/medicine.entity';
import { FindOneUuidMedicineDto } from './dto/find-one-uuid-medicine.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('medicines')
@ApiTags('Medicamentos')
export class MedicinesController {
  public constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  public async create(
    @Body() createMedicineDto: CreateMedicineDto,
  ): Promise<Medicine> {
    return this.medicinesService.create(createMedicineDto);
  }

  @Get()
  public async findAll(): Promise<Medicine[]> {
    return this.medicinesService.findAll();
  }

  @Get(':id')
  public async findOne(
    findOneUuidMedicineDto: FindOneUuidMedicineDto,
  ): Promise<Medicine | null> {
    return this.medicinesService.findOne(findOneUuidMedicineDto.id);
  }

  @Patch(':id')
  public async update(
    findOneUuidMedicineDto: FindOneUuidMedicineDto,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    return this.medicinesService.update(
      findOneUuidMedicineDto.id,
      updateMedicineDto,
    );
  }

  @Delete(':id')
  public async remove(
    findOneUuidMedicineDto: FindOneUuidMedicineDto,
  ): Promise<Medicine> {
    return this.medicinesService.remove(findOneUuidMedicineDto.id);
  }
}
