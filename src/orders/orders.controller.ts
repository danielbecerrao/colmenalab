import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { Order } from './entities/order.entity';
import { FindOneUuidOrderDto } from './dto/find-one-uuid-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Ordenes')
export class OrdersController {
  public constructor(private readonly ordersService: OrdersService) {}

  @Post()
  public async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  public async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  public async findOne(
    findOneUuidOrderDto: FindOneUuidOrderDto,
  ): Promise<Order | null> {
    return this.ordersService.findOne(findOneUuidOrderDto.id);
  }

  @Patch(':id')
  public async update(
    findOneUuidOrderDto: FindOneUuidOrderDto,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(findOneUuidOrderDto.id, updateOrderDto);
  }

  @Delete(':id')
  public async remove(
    findOneUuidOrderDto: FindOneUuidOrderDto,
  ): Promise<Order> {
    return this.ordersService.remove(findOneUuidOrderDto.id);
  }
}
