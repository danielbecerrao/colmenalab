import { Controller, Get } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import type { Schedule } from './entities/schedule.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('schedules')
@ApiTags('Horarios')
export class SchedulesController {
  public constructor(private readonly schedulesService: SchedulesService) {}
  @Get()
  public async findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }
}
