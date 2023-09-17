import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiseaseToMedicineService } from './disease-to-medicine.service';
import { CreateDiseaseToMedicineDto } from './dto/create-disease-to-medicine.dto';
import { UpdateDiseaseToMedicineDto } from './dto/update-disease-to-medicine.dto';
import type { DiseaseToMedicine } from './entities/disease-to-medicine.entity';
import { ApiTags } from '@nestjs/swagger';
import { FindOneDiseaseToMedicineDto } from './dto/find-one-disease-to-medicine.dto';

@Controller('disease-to-medicine')
@ApiTags('Medicamentos a enfermedades')
export class DiseaseToMedicineController {
  public constructor(
    private readonly diseaseToMedicineService: DiseaseToMedicineService,
  ) {}

  @Post()
  public async create(
    @Body() createDiseaseToMedicineDto: CreateDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine> {
    return this.diseaseToMedicineService.create(createDiseaseToMedicineDto);
  }

  @Get()
  public async findAll(): Promise<DiseaseToMedicine[]> {
    return this.diseaseToMedicineService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param() findOneDiseaseToMedicineDto: FindOneDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine | null> {
    return this.diseaseToMedicineService.findOne(
      findOneDiseaseToMedicineDto.id,
    );
  }

  @Patch(':id')
  public async update(
    @Param() findOneDiseaseToMedicineDto: FindOneDiseaseToMedicineDto,
    @Body() updateDiseaseToMedicineDto: UpdateDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine> {
    return this.diseaseToMedicineService.update(
      findOneDiseaseToMedicineDto.id,
      updateDiseaseToMedicineDto,
    );
  }

  @Delete(':id')
  public async remove(
    @Param() findOneDiseaseToMedicineDto: FindOneDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine> {
    return this.diseaseToMedicineService.remove(findOneDiseaseToMedicineDto.id);
  }
}
