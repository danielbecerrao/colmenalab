import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { Order } from './entities/order.entity';
import { FindOneOrderDto } from './dto/find-one-order.dto';
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
    findOneUuidOrderDto: FindOneOrderDto,
  ): Promise<Order | null> {
    return this.ordersService.findOne(findOneUuidOrderDto.id);
  }

  @Patch(':id')
  public async update(
    findOneUuidOrderDto: FindOneOrderDto,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(findOneUuidOrderDto.id, updateOrderDto);
  }

  @Delete(':id')
  public async remove(
    findOneUuidOrderDto: FindOneOrderDto,
  ): Promise<Order> {
    return this.ordersService.remove(findOneUuidOrderDto.id);
  }
}
