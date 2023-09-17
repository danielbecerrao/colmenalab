import { IsNotEmpty, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateOrderToMedicineDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public orderId!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID('4', { message: i18nValidationMessage('validation.INVALID_UUID') })
  public medicineId!: string;
}
