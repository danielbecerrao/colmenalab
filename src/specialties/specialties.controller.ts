import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import type { Specialty } from './entities/specialty.entity';
import { FindOneSpecialtyDto } from './dto/find-one-specialty.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('specialties')
@ApiTags('Especialidades')
export class SpecialtiesController {
  public constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  public async create(
    @Body() createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtiesService.create(createSpecialtyDto);
  }

  @Get()
  public async findAll(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  public async findOne(
    findOneUuidSpecialtyDto: FindOneSpecialtyDto,
  ): Promise<Specialty | null> {
    return this.specialtiesService.findOne(findOneUuidSpecialtyDto.id);
  }

  @Patch(':id')
  public async update(
    findOneUuidSpecialtyDto: FindOneSpecialtyDto,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtiesService.update(
      findOneUuidSpecialtyDto.id,
      updateSpecialtyDto,
    );
  }

  @Delete(':id')
  public async remove(
    findOneUuidSpecialtyDto: FindOneSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtiesService.remove(findOneUuidSpecialtyDto.id);
  }
}
