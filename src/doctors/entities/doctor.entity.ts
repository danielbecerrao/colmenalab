import { Appointment } from '../../appointments/entities/appointment.entity';
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

@Entity('doctors')
@Unique(['identification'])
export class Doctor {
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

  @Column({
    type: 'varchar',
    length: 90,
  })
  public profesionalCard!: string;

  @Column({
    type: 'timestamptz',
  })
  public contractingDate!: Date;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date | null;

  @OneToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.doctor,
  )
  public appointments!: Appointment[];
}
