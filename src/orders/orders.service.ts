import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  public constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  public async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order: Order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  public async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  public async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order: Order | null = await this.findOne(id);
    if (!order)
      throw new NotFoundException('Error al actualizar orden', {
        cause: new Error(),
        description: 'Orden no encontrada por id',
      });
    return this.orderRepository.save(Object.assign(order, updateOrderDto));
  }

  public async remove(id: string): Promise<Order> {
    const order: Order | null = await this.findOne(id);
    if (!order)
      throw new NotFoundException('Error al eliminar orden', {
        cause: new Error(),
        description: 'Orden no encontrada por id',
      });
    return this.orderRepository.softRemove(order);
  }
}
