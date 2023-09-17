import { Module } from '@nestjs/common';
import { DiseaseToMedicineService } from './disease-to-medicine.service';
import { DiseaseToMedicineController } from './disease-to-medicine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseToMedicine } from './entities/disease-to-medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiseaseToMedicine])],
  controllers: [DiseaseToMedicineController],
  providers: [DiseaseToMedicineService],
})
export class DiseaseToMedicineModule {}
