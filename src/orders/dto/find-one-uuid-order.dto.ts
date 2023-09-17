import { IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FindOneUuidOrderDto {
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public id!: string;
}
