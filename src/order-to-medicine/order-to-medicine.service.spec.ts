import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrderToMedicineService } from './order-to-medicine.service';

describe('OrderToMedicineService', () => {
  let service: OrderToMedicineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderToMedicineService],
    }).compile();

    service = module.get<OrderToMedicineService>(OrderToMedicineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
