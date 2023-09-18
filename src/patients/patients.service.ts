import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreatePatientDto } from './dto/create-patient.dto';
import type { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  public constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}
  public async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existPatient = await this.findOneByIdentification(
      createPatientDto.identification,
    );
    if (existPatient)
      throw new ConflictException('Error al crear paciente', {
        cause: new Error(),
        description: 'Ya existe un paciente con este documento',
      });
    try {
      const patient: Patient = this.patientRepository.create(createPatientDto);
      return await this.patientRepository.save(patient);
    } catch (error) {
      throw new BadRequestException('Error al crear paciente', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  public async findOne(id: string): Promise<Patient | null> {
    return this.patientRepository.findOneBy({
      id,
    });
  }

  public async findOneByIdentification(
    identification: string,
  ): Promise<Patient | null> {
    return this.patientRepository.findOneBy({ identification });
  }

  public async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient: Patient | null = await this.findOne(id);
    if (!patient)
      throw new NotFoundException('Error al actualizar paciente', {
        cause: new Error(),
        description: 'Paciente no encontrado por id',
      });
    if (
      updatePatientDto.identification &&
      updatePatientDto.identification !== patient.identification
    ) {
      const existPatient = await this.findOneByIdentification(
        updatePatientDto.identification,
      );
      if (existPatient)
        throw new ConflictException('Error al actualizar paciente', {
          cause: new Error(),
          description: 'Ya existe un paciente con este documento',
        });
    }
    return this.patientRepository.save(
      Object.assign(patient, updatePatientDto),
    );
  }

  public async remove(id: string): Promise<Patient> {
    const patient: Patient | null = await this.findOne(id);
    if (!patient)
      throw new NotFoundException('Error al eliminar paciente', {
        cause: new Error(),
        description: 'Paciente no encontrado por id',
      });
    return this.patientRepository.softRemove(patient);
  }
}
