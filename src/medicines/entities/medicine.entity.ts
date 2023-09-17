import { DiseaseToMedicine } from 'src/disease-to-medicine/entities/disease-to-medicine.entity';
import { OrderToMedicine } from 'src/order-to-medicine/entities/order-to-medicine.entity';
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

@Entity('medicines')
@Unique(['name'])
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;

  @OneToMany(
    () => DiseaseToMedicine,
    (diseasesToMedicine: DiseaseToMedicine) => diseasesToMedicine.medicine,
  )
  public diseaseToMedicine!: DiseaseToMedicine[];

  @OneToMany(
    () => OrderToMedicine,
    (orderToMedicine: OrderToMedicine) => orderToMedicine.medicine,
  )
  public orderToMedicine!: OrderToMedicine[];
}
