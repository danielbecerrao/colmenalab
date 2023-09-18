import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import type { Disease } from './entities/disease.entity';
import { FindOneDiseaseDto } from './dto/find-one-disease.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('diseases')
@ApiTags('Enfermedades')
export class DiseasesController {
  public constructor(private readonly diseasesService: DiseasesService) {}

  @Post()
  public async create(
    @Body() createDiseaseDto: CreateDiseaseDto,
  ): Promise<Disease> {
    return this.diseasesService.create(createDiseaseDto);
  }

  @Get()
  public async findAll(): Promise<Disease[]> {
    return this.diseasesService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param() findOneUuidDiseaseDto: FindOneDiseaseDto,
  ): Promise<Disease | null> {
    return this.diseasesService.findOne(findOneUuidDiseaseDto.id);
  }

  @Patch(':id')
  public async update(
    @Param() findOneUuidDiseaseDto: FindOneDiseaseDto,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<Disease> {
    return this.diseasesService.update(
      findOneUuidDiseaseDto.id,
      updateDiseaseDto,
    );
  }

  @Delete(':id')
  public async remove(
    @Param() findOneUuidDiseaseDto: FindOneDiseaseDto,
  ): Promise<Disease> {
    return this.diseasesService.remove(findOneUuidDiseaseDto.id);
  }
}
