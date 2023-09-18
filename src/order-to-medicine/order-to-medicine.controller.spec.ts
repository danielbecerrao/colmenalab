import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrderToMedicineController } from './order-to-medicine.controller';
import { OrderToMedicineService } from './order-to-medicine.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderToMedicine } from './entities/order-to-medicine.entity';
import { FindOneOrderToMedicineDto } from './dto/find-one-order-to-medicine.dto';
import type { CreateOrderToMedicineDto } from './dto/create-order-to-medicine.dto';
import type { UpdateOrderToMedicineDto } from './dto/update-order-to-medicine.dto';
import { NotFoundException } from '@nestjs/common';
import { Medicine } from '../medicines/entities/medicine.entity';
import { Order } from '../orders/entities/order.entity';

describe('OrderToMedicinesController', () => {
  let controller: OrderToMedicineController;
  let service: OrderToMedicineService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderToMedicineController],
      providers: [
        OrderToMedicineService,
        {
          provide: getRepositoryToken(OrderToMedicine),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<OrderToMedicineController>(
      OrderToMedicineController,
    );
    service = module.get<OrderToMedicineService>(OrderToMedicineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of OrderToMedicines', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of OrderToMedicines', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a OrderToMedicines when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneOrderToMedicineDto = new FindOneOrderToMedicineDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneOrderToMedicineDto = new FindOneOrderToMedicineDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new OrderToMedicines', async () => {
      const dto: CreateOrderToMedicineDto = {
        medicineId: '35108836-5718-4633-8b97-158f352d2188',
        orderId: '785bc80c-ebbf-4736-aef3-9a9d3258f11f',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a OrderToMedicines', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateOrderToMedicineDto = {
        medicineId: '35108836-5718-4633-8b97-158f352d2188',
        orderId: '785bc80c-ebbf-4736-aef3-9a9d3258f11f',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a OrderToMedicines', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';
      jest.spyOn(service, 'remove').mockResolvedValue(mock);
      const result = await controller.remove({ id });
      expect(result).toEqual(mock);
    });

    it('should throw a NotFoundException when an invalid ID is provided', async () => {
      const invalidId = '5f81ae87-8956-4cd4-868e-aec571b6470e';
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove({ id: invalidId })).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
