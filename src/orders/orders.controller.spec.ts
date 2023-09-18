import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { FindOneOrderDto } from './dto/find-one-order.dto';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException } from '@nestjs/common';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Specialty } from '../specialties/entities/specialty.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  const mock: Order = {
    id: 'c5d96360-a2ca-4899-a114-77240a6f1864',
    appointment: new Appointment(),
    appointmentId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
    description: 'dolor',
    expiration: new Date(),
    orderToMedicine: [],
    specialty: new Specialty(),
    specialtyId: '35108836-5718-4633-8b97-158f352d2188',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Orders', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'findAll').mockResolvedValue(mocks);

      const result = await controller.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Orders', async () => {
      const mock = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(mock);

      const result = await controller.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a Order when a valid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mock);

      const dto: FindOneOrderDto = new FindOneOrderDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1864';
      const result = await controller.findOne(dto);

      expect(result).toEqual(mock);
    });

    it('should return 404 when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const dto: FindOneOrderDto = new FindOneOrderDto();
      dto.id = 'c5d96360-a2ca-4899-a114-77240a6f1865';
      const result = await controller.findOne(dto);

      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should create a new Order', async () => {
      const dto: CreateOrderDto = {
        appointmentId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
        description: 'dolor',
        expiration: new Date(),
        specialtyId: '35108836-5718-4633-8b97-158f352d2188',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mock);

      const result = await controller.create(dto);

      expect(result).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a Order', async () => {
      const id = 'dae26cdd-19af-4b87-9ce0-1dae2efbe59c';

      const dto: UpdateOrderDto = {
        appointmentId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
        description: 'dolor',
        expiration: new Date(),
        specialtyId: '35108836-5718-4633-8b97-158f352d2188',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mock);
      const result = await controller.update({ id }, dto);
      expect(result).toEqual(mock);
    });
  });

  describe('remove', () => {
    it('should remove a Order', async () => {
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
