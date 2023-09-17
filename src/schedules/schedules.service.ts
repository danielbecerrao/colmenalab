import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulesService {
  public constructor(
    @InjectRepository(Schedule)
    private readonly doctorRepository: Repository<Schedule>,
  ) {}

  public async findAll(): Promise<Schedule[]> {
    return this.doctorRepository.find();
  }
}
