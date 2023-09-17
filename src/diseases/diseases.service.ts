import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateDiseaseDto } from './dto/create-disease.dto';
import type { UpdateDiseaseDto } from './dto/update-disease.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiseasesService {
  public constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
  ) {}
  public async create(createDiseaseDto: CreateDiseaseDto): Promise<Disease> {
    const existDisease = await this.findOneByName(createDiseaseDto.name);
    if (existDisease)
      throw new ConflictException('Error al crear enfermedad', {
        cause: new Error(),
        description: 'Ya existe una enfermedad con este nombre',
      });
    const disease: Disease = this.diseaseRepository.create(createDiseaseDto);
    return this.diseaseRepository.save(disease);
  }

  public async findAll(): Promise<Disease[]> {
    return this.diseaseRepository.find();
  }

  public async findOne(id: string): Promise<Disease | null> {
    return this.diseaseRepository.findOneBy({ id });
  }

  public async findOneByName(name: string): Promise<Disease | null> {
    return this.diseaseRepository.findOneBy({ name });
  }

  public async update(
    id: string,
    updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<Disease> {
    if (updateDiseaseDto.name) {
      const existDisease = await this.findOneByName(updateDiseaseDto.name);
      if (existDisease)
        throw new ConflictException('Error al crear enfermedad', {
          cause: new Error(),
          description: 'Ya existe una enfermedad con este nombre',
        });
    }
    const disease: Disease | null = await this.findOne(id);
    if (!disease)
      throw new NotFoundException('Error al actualizar enfermedad', {
        cause: new Error(),
        description: 'Enfermedad no encontrada por id',
      });
    return this.diseaseRepository.save(
      Object.assign(disease, updateDiseaseDto),
    );
  }

  public async remove(id: string): Promise<Disease> {
    const disease: Disease | null = await this.findOne(id);
    if (!disease)
      throw new NotFoundException('Error al eliminar enfermedad', {
        cause: new Error(),
        description: 'Enfermedad no encontrada por id',
      });
    return this.diseaseRepository.softRemove(disease);
  }
}
