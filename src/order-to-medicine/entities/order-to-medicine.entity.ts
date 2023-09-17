import { Order } from 'src/orders/entities/order.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ordertomedicine')
export class OrderToMedicine {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public orderId!: string;

  @ManyToOne(() => Order, (order: Order) => order.orderToMedicine)
  public order!: Order;

  @Column()
  public medicineId!: string;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.orderToMedicine)
  public medicine!: Medicine;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;
}
