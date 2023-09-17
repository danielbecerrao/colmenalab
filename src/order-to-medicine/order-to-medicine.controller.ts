import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderToMedicineService } from './order-to-medicine.service';
import { CreateOrderToMedicineDto } from './dto/create-order-to-medicine.dto';
import { UpdateOrderToMedicineDto } from './dto/update-order-to-medicine.dto';
import type { OrderToMedicine } from './entities/order-to-medicine.entity';
import { ApiTags } from '@nestjs/swagger';
import { FindOneOrderToMedicineDto } from './dto/find-one-order-to-medicine.dto';

@Controller('order-to-medicine')
@ApiTags('Orden a medicamento')
export class OrderToMedicineController {
  public constructor(
    private readonly orderToMedicineService: OrderToMedicineService,
  ) {}

  @Post()
  public async create(
    @Body() createOrderToMedicineDto: CreateOrderToMedicineDto,
  ): Promise<OrderToMedicine> {
    return this.orderToMedicineService.create(createOrderToMedicineDto);
  }

  @Get()
  public async findAll(): Promise<OrderToMedicine[]> {
    return this.orderToMedicineService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param() findOneOrderToMedicineDto: FindOneOrderToMedicineDto,
  ): Promise<OrderToMedicine | null> {
    return this.orderToMedicineService.findOne(findOneOrderToMedicineDto.id);
  }

  @Patch(':id')
  public async update(
    @Param() findOneOrderToMedicineDto: FindOneOrderToMedicineDto,
    @Body() updateOrderToMedicineDto: UpdateOrderToMedicineDto,
  ): Promise<OrderToMedicine> {
    return this.orderToMedicineService.update(
      findOneOrderToMedicineDto.id,
      updateOrderToMedicineDto,
    );
  }

  @Delete(':id')
  public async remove(
    @Param() findOneOrderToMedicineDto: FindOneOrderToMedicineDto,
  ): Promise<OrderToMedicine> {
    return this.orderToMedicineService.remove(findOneOrderToMedicineDto.id);
  }
}
