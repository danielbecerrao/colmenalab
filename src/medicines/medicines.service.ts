import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateMedicineDto } from './dto/create-medicine.dto';
import type { UpdateMedicineDto } from './dto/update-medicine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicinesService {
  public constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}
  public async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const existMedicine = await this.findOneByName(createMedicineDto.name);
    if (existMedicine)
      throw new ConflictException('Error al crear medicamento', {
        cause: new Error(),
        description: 'Ya existe una medicamento con este nombre',
      });
    const medicine: Medicine =
      this.medicineRepository.create(createMedicineDto);
    return this.medicineRepository.save(medicine);
  }

  public async findAll(): Promise<Medicine[]> {
    return this.medicineRepository.find();
  }

  public async findOne(id: string): Promise<Medicine | null> {
    return this.medicineRepository.findOneBy({ id });
  }

  public async findOneByName(name: string): Promise<Medicine | null> {
    return this.medicineRepository.findOneBy({ name });
  }

  public async update(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    if (updateMedicineDto.name) {
      const existMedicine = await this.findOneByName(updateMedicineDto.name);
      if (existMedicine)
        throw new ConflictException('Error al actualizar medicamento', {
          cause: new Error(),
          description: 'Ya existe una medicamento con este nombre',
        });
    }
    const medicine: Medicine | null = await this.findOne(id);
    if (!medicine)
      throw new NotFoundException('Error al actualizar medicamento', {
        cause: new Error(),
        description: 'Enfermedad no encontrada por id',
      });
    return this.medicineRepository.save(
      Object.assign(medicine, updateMedicineDto),
    );
  }

  public async remove(id: string): Promise<Medicine> {
    const medicine: Medicine | null = await this.findOne(id);
    if (!medicine)
      throw new NotFoundException('Error al eliminar medicamento', {
        cause: new Error(),
        description: 'Medicamento no encontrado por id',
      });
    return this.medicineRepository.softRemove(medicine);
  }
}
