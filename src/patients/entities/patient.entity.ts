import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
@Unique(['identification'])
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  public identification!: string;

  @Column({
    type: 'varchar',
    length: 90,
  })
  public firstname!: string;

  @Column({
    type: 'varchar',
    length: 90,
  })
  public lastname!: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  public email!: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  public phone!: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  public address!: string;

  @Column({
    type: 'varchar',
    length: 90,
  })
  public city!: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;

  @OneToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.patient,
  )
  public appointments!: Appointment[];
}
