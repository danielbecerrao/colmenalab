import { PartialType } from '@nestjs/swagger';
import { CreateOrderToMedicineDto } from './create-order-to-medicine.dto';

export class UpdateOrderToMedicineDto extends PartialType(
  CreateOrderToMedicineDto,
) {}
