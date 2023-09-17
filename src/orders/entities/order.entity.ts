import { Appointment } from 'src/appointments/entities/appointment.entity';
import { OrderToMedicine } from 'src/order-to-medicine/entities/order-to-medicine.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public description!: string;

  @Column({
    type: 'date',
  })
  public expiration!: Date;

  @Column()
  public specialtyId!: string;

  @ManyToOne(() => Specialty, (specialty: Specialty) => specialty.orders)
  public specialty!: Specialty;

  @Column()
  public appointmentId!: string;

  @ManyToOne(
    () => Appointment,
    (appointment: Appointment) => appointment.orders,
  )
  public appointment!: Appointment;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;

  @OneToMany(
    () => OrderToMedicine,
    (orderToMedicine: OrderToMedicine) => orderToMedicine.order,
  )
  public orderToMedicine!: OrderToMedicine[];
}
