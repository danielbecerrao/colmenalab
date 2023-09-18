import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'time',
  })
  public from!: string;

  @Column({
    type: 'time',
  })
  public to!: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date | null;

  @OneToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.schedule,
  )
  public appointments!: Appointment[];
}
