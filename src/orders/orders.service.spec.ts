import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import type { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';
import type { UpdateOrderDto } from './dto/update-order.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Specialty } from '../specialties/entities/specialty.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;
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
  const createDto: CreateOrderDto = {
    appointmentId: '670ca9d0-bb96-4fb4-b332-e659faa7374f',
    description: 'dolor',
    expiration: new Date(),
    specialtyId: '35108836-5718-4633-8b97-158f352d2188',
  };
  const updateDto: UpdateOrderDto = {
    appointmentId: '14b8bbed-259b-4787-ad11-7de940815d28',
    description: 'dolor',
    expiration: new Date(),
    specialtyId: '35108836-5718-4633-8b97-158f352d2188',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Orders', async () => {
      const mocks: Order[] = [mock, mock];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });

    it('should return an empty array of Orders', async () => {
      const mocks: Order[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(mocks);

      const result = await service.findAll();
      expect(result).toEqual(mocks);
    });
  });

  describe('findOne', () => {
    it('should return a Order object when a valid id is passed', async () => {
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
    it('should create a new order', async () => {
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
    it('should remove a specialty when a valid ID is provided', async () => {
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
