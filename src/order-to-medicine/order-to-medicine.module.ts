import { Module } from '@nestjs/common';
import { OrderToMedicineService } from './order-to-medicine.service';
import { OrderToMedicineController } from './order-to-medicine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderToMedicine } from './entities/order-to-medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderToMedicine])],
  controllers: [OrderToMedicineController],
  providers: [OrderToMedicineService],
})
export class OrderToMedicineModule {}
