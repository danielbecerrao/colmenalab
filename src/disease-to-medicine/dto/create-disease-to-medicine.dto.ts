import { IsNotEmpty, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDiseaseToMedicineDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public diseaseId!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public medicineId!: string;
}
