import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateDiseaseToMedicineDto } from './dto/create-disease-to-medicine.dto';
import type { UpdateDiseaseToMedicineDto } from './dto/update-disease-to-medicine.dto';
import { DiseaseToMedicine } from './entities/disease-to-medicine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiseaseToMedicineService {
  public constructor(
    @InjectRepository(DiseaseToMedicine)
    private readonly diseaseToMedicineRepository: Repository<DiseaseToMedicine>,
  ) {}

  public async create(
    createDiseaseToMedicineDto: CreateDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine> {
    const diseaseToMedicine: DiseaseToMedicine =
      this.diseaseToMedicineRepository.create(createDiseaseToMedicineDto);
    return this.diseaseToMedicineRepository.save(diseaseToMedicine);
  }

  public async findAll(): Promise<DiseaseToMedicine[]> {
    return this.diseaseToMedicineRepository.find();
  }

  public async findOne(id: string): Promise<DiseaseToMedicine | null> {
    return this.diseaseToMedicineRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateDiseaseToMedicineDto: UpdateDiseaseToMedicineDto,
  ): Promise<DiseaseToMedicine> {
    const diseaseToMedicine: DiseaseToMedicine | null = await this.findOne(id);
    if (!diseaseToMedicine)
      throw new NotFoundException(
        'Error al actualizar relación enfermedad-medicamento',
        {
          cause: new Error(),
          description: 'Relación enfermedad-medicamento no encontrada por id',
        },
      );
    return this.diseaseToMedicineRepository.save(
      Object.assign(diseaseToMedicine, updateDiseaseToMedicineDto),
    );
  }

  public async remove(id: string): Promise<DiseaseToMedicine> {
    const diseaseToMedicine: DiseaseToMedicine | null = await this.findOne(id);
    if (!diseaseToMedicine)
      throw new NotFoundException(
        'Error al eliminar relación enfermedad-medicamento',
        {
          cause: new Error(),
          description: 'Relación enfermedad-medicamento no encontrada por id',
        },
      );
    return this.diseaseToMedicineRepository.softRemove(diseaseToMedicine);
  }
}
