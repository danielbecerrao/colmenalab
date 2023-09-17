import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateSpecialtyDto } from './dto/create-specialty.dto';
import type { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialtiesService {
  public constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}
  public async create(
    createSpecialtyDto: CreateSpecialtyDto,
  ): Promise<Specialty> {
    const existSpecialty = await this.findOneByName(createSpecialtyDto.name);
    if (existSpecialty)
      throw new ConflictException('Error al crear especialidad', {
        cause: new Error(),
        description: 'Ya existe una especialidad con este nombre',
      });
    const specialty: Specialty =
      this.specialtyRepository.create(createSpecialtyDto);
    return this.specialtyRepository.save(specialty);
  }

  public async findAll(): Promise<Specialty[]> {
    return this.specialtyRepository.find();
  }

  public async findOne(id: string): Promise<Specialty | null> {
    return this.specialtyRepository.findOneBy({ id });
  }

  public async findOneByName(name: string): Promise<Specialty | null> {
    return this.specialtyRepository.findOneBy({ name });
  }

  public async update(
    id: string,
    updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    if (updateSpecialtyDto.name) {
      const existSpecialty = await this.findOneByName(updateSpecialtyDto.name);
      if (existSpecialty)
        throw new ConflictException('Error al crear especialidad', {
          cause: new Error(),
          description: 'Ya existe una especialidad con este nombre',
        });
    }
    const specialty: Specialty | null = await this.findOne(id);
    if (!specialty)
      throw new NotFoundException('Error al actualizar especialdad', {
        cause: new Error(),
        description: 'Especialdad no encontrada por id',
      });
    return this.specialtyRepository.save(
      Object.assign(specialty, updateSpecialtyDto),
    );
  }

  public async remove(id: string): Promise<Specialty> {
    const specialty: Specialty | null = await this.findOne(id);
    if (!specialty)
      throw new NotFoundException('Error al eliminar especialdad', {
        cause: new Error(),
        description: 'Especialdad no encontrada por id',
      });
    return this.specialtyRepository.softRemove(specialty);
  }
}
