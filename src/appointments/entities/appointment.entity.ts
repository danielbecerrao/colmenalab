import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('appointments')
@Unique(['doctorId', 'date', 'scheduleId'])
@Unique(['patientId', 'date', 'scheduleId'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public patientId!: string;

  @ManyToOne(() => Patient, (patient: Patient) => patient.appointments)
  public patient!: Patient;

  @Column()
  public doctorId!: string;

  @ManyToOne(() => Doctor, (doctor: Doctor) => doctor.appointments)
  public doctor!: Doctor;

  @Column({
    type: 'date',
  })
  public date!: Date;

  @Column()
  public scheduleId!: string;

  @ManyToOne(() => Schedule, (schedule: Schedule) => schedule.appointments)
  public schedule!: Schedule;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Programada,
  })
  public status!: Status;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;

  @OneToMany(() => Order, (order: Order) => order.appointment)
  public orders!: Order[];
}
