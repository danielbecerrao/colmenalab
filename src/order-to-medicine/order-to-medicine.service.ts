import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateOrderToMedicineDto } from './dto/create-order-to-medicine.dto';
import type { UpdateOrderToMedicineDto } from './dto/update-order-to-medicine.dto';
import { OrderToMedicine } from './entities/order-to-medicine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderToMedicineService {
  public constructor(
    @InjectRepository(OrderToMedicine)
    private readonly orderToMedicineRepository: Repository<OrderToMedicine>,
  ) {}

  public async create(
    createOrderToMedicineDto: CreateOrderToMedicineDto,
  ): Promise<OrderToMedicine> {
    const orderToMedicine: OrderToMedicine =
      this.orderToMedicineRepository.create(createOrderToMedicineDto);
    return this.orderToMedicineRepository.save(orderToMedicine);
  }

  public async findAll(): Promise<OrderToMedicine[]> {
    return this.orderToMedicineRepository.find();
  }

  public async findOne(id: string): Promise<OrderToMedicine | null> {
    return this.orderToMedicineRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateOrderToMedicineDto: UpdateOrderToMedicineDto,
  ): Promise<OrderToMedicine> {
    const orderToMedicine: OrderToMedicine | null = await this.findOne(id);
    if (!orderToMedicine)
      throw new NotFoundException(
        'Error al actualizar relación orden-medicamento',
        {
          cause: new Error(),
          description: 'Relación orden-medicamento no encontrada por id',
        },
      );
    return this.orderToMedicineRepository.save(
      Object.assign(orderToMedicine, updateOrderToMedicineDto),
    );
  }

  public async remove(id: string): Promise<OrderToMedicine> {
    const orderToMedicine: OrderToMedicine | null = await this.findOne(id);
    if (!orderToMedicine)
      throw new NotFoundException(
        'Error al eliminar relación orden-medicamento',
        {
          cause: new Error(),
          description: 'Relación orden-medicamento no encontrada por id',
        },
      );
    return this.orderToMedicineRepository.softRemove(orderToMedicine);
  }
}
