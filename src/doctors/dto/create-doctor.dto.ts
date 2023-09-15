import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDoctorDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumberString(
    {
      no_symbols: true,
    },
    { message: i18nValidationMessage('validation.INVALID_NUMBER_STRING') },
  )
  @MaxLength(20, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public identification!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(90, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public firstname!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(90, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public lastname!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(200, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  public email!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(20, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public phone!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(200, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public address!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(90, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public city!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(90, {
    message: i18nValidationMessage('validation.INVALID_MAX_LENGTH'),
  })
  public profesionalCard!: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsDateString()
  public contractingDate!: Date;
}
