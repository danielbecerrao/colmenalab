import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DiseaseToMedicineController } from './disease-to-medicine.controller';
import { DiseaseToMedicineService } from './disease-to-medicine.service';

describe('DiseaseToMedicineController', () => {
  let controller: DiseaseToMedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiseaseToMedicineController],
      providers: [DiseaseToMedicineService],
    }).compile();

    controller = module.get<DiseaseToMedicineController>(
      DiseaseToMedicineController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
