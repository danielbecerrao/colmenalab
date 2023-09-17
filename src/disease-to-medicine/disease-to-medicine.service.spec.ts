import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DiseaseToMedicineService } from './disease-to-medicine.service';

describe('DiseaseToMedicineService', () => {
  let service: DiseaseToMedicineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiseaseToMedicineService],
    }).compile();

    service = module.get<DiseaseToMedicineService>(DiseaseToMedicineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
