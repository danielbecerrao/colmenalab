import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrderToMedicineController } from './order-to-medicine.controller';
import { OrderToMedicineService } from './order-to-medicine.service';

describe('OrderToMedicineController', () => {
  let controller: OrderToMedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderToMedicineController],
      providers: [OrderToMedicineService],
    }).compile();

    controller = module.get<OrderToMedicineController>(
      OrderToMedicineController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
