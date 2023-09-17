import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsIn, IsOptional } from 'class-validator';
import { Status } from '../enums/status.enum';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsIn([1, 2])
  public status!: Status;
}
