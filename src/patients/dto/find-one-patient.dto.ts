import { IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindOnePatientDto {
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public id!: string;
}
