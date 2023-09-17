import { Disease } from 'src/diseases/entities/disease.entity';
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

@Entity('diseasetomedicine')
export class DiseaseToMedicine {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public diseaseId!: string;

  @ManyToOne(() => Disease, (disease: Disease) => disease.diseaseToMedicine)
  public disease!: Disease;

  @Column()
  public medicineId!: string;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.diseaseToMedicine)
  public medicine!: Medicine;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt!: Date;
}
