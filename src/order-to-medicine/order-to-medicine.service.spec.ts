import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrderToMedicineService } from './order-to-medicine.service';
import { OrderToMedicine } from './entities/order-to-medicine.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from '../medicines/entities/medicine.entity';
import { Order } from '../orders/entities/order.entity';
import type { CreateOrderToMedicineDto } from './dto/create-order-to-medicine.dto';
import type { UpdateOrderToMedicineDto } from './dto/update-order-to-medicine.dto';
import { NotFoundException } from '@nestjs/common';

describe('OrderToMedicineService', () => {
  let service: OrderToMedicineService;
  let repository: Repository<OrderToMedicine>;
  const mock: OrderToMedicine = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    medicine: new Medicine(),
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
    order: new Order(),
    orderId: '785bc80c-ebbf-4736-aef3-9a9d3258f11f',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  const createDto: CreateOrderToMedicineDto = {
    orderId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
  };
  const updateDto: UpdateOrderToMedicineDto = {
    orderId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
    medicineId: '35108836-5718-4633-8b97-158f352d2188',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderToMedicineService,
        {
          provide: getRepositoryToken(OrderToMedicine),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderToMedicineService>(OrderToMedicineService);
    repository = module.get<Repository<OrderToMedicine>>(
      getRepositoryToken(OrderToMedicine),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of OrderToMedicine', async () => {
      const mocks: OrderToMedicine[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of OrderToMedicine', async () => {
      const mock: OrderToMedicine[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mock);

      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a OrderToMedicine object when a valid id is passed', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);

      const id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await service.findOne(id);

      expect(result).toEqual(mock);
    });

    it('should return null when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new OrderToMedicines', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);
      const result = await service.create(createDto);
      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const orderId = '14b8bbed-259b-4787-ad11-7de940815d28';
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock,
        ...updateDto,
      });
      const result = await service.update(orderId, updateDto);
      expect(result).toEqual({
        ...mock,
        ...updateDto,
      });
    });

    it('should throw a NotFoundException when updating a non-existent order', async () => {
      const nonExistentOrderId = '14b8bbed-259b-4787-ad11-7de940815d56';
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(nonExistentOrderId, updateDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a OrderToMedicines when a valid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mock);
      jest.spyOn(repository, 'softRemove').mockResolvedValue(mock);

      const result = await service.remove(
        'dae26cdd-19af-4b87-9ce0-1dae2efbe59c',
      );

      expect(result).toEqual(mock);
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove('invalidId')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
