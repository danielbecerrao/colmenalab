import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateDoctorDto } from './dto/create-doctor.dto';
import type { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorsService {
  public constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}
  public async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existDoctor = await this.findOneByIdentification(
      createDoctorDto.identification,
    );
    if (existDoctor)
      throw new ConflictException('Error al crear doctor', {
        cause: new Error(),
        description: 'Ya existe un doctor con este documento',
      });
    try {
      const doctor: Doctor = this.doctorRepository.create(createDoctorDto);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new BadRequestException('Error al crear doctor', {
        cause: new Error(),
        description: `Ocurrió un error en el servidor: ${error}}`,
      });
    }
  }

  public async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  public async findOne(id: string): Promise<Doctor | null> {
    return this.doctorRepository.findOneBy({ id });
  }

  public async findOneByIdentification(
    identification: string,
  ): Promise<Doctor | null> {
    return this.doctorRepository.findOneBy({ identification });
  }

  public async update(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const doctor: Doctor | null = await this.findOne(id);
    if (!doctor)
      throw new NotFoundException('Error al actualizar doctor', {
        cause: new Error(),
        description: 'Doctor no encontrado por id',
      });
    if (
      updateDoctorDto.identification &&
      updateDoctorDto.identification !== doctor.identification
    ) {
      const existDoctor = await this.findOneByIdentification(
        updateDoctorDto.identification,
      );
      if (existDoctor)
        throw new ConflictException('Error al actualizar doctor', {
          cause: new Error(),
          description: 'Ya existe un doctor con este documento',
        });
    }
    return this.doctorRepository.save(Object.assign(doctor, updateDoctorDto));
  }

  public async remove(id: string): Promise<Doctor> {
    const doctor: Doctor | null = await this.findOne(id);
    if (!doctor)
      throw new NotFoundException('Error al eliminar doctor', {
        cause: new Error(),
        description: 'Doctor no encontrado por id',
      });
    return this.doctorRepository.softRemove(doctor);
  }
}
