import { DiseaseToMedicine } from '../../disease-to-medicine/entities/disease-to-medicine.entity';
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

@Entity('diseases')
@Unique(['name'])
export class Disease {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date | null;

  @OneToMany(
    () => DiseaseToMedicine,
    (diseaseToMedicine: DiseaseToMedicine) => diseaseToMedicine.disease,
  )
  public diseaseToMedicine!: DiseaseToMedicine[];
}
