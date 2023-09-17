import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindAppointmentsDto {
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsOptional()
  public patientIdentification?: string;

  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsOptional()
  public doctorIdentification?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public date?: Date;
}
