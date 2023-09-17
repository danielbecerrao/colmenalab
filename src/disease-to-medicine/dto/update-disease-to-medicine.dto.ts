import { PartialType } from '@nestjs/swagger';
import { CreateDiseaseToMedicineDto } from './create-disease-to-medicine.dto';

export class UpdateDiseaseToMedicineDto extends PartialType(
  CreateDiseaseToMedicineDto,
) {}
