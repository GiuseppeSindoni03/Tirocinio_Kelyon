import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { MedicalExamination } from 'src/medical-examination/medical-examination.entity';
import { Doctor } from 'src/doctor/doctor.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  height: number;

  @Column()
  bloodType: string;

  @Column()
  level: string;

  @Column()
  sport: string;

  @Column('text', { array: true })
  patologies: string[];

  @Column('text', { array: true })
  medications: string[];

  @Column('text', { array: true })
  injuries: string[];

  @OneToMany(
    () => MedicalExamination,
    (medicalExamination) => medicalExamination.patient,
    { nullable: true },
  )
  medicalExaminations: MedicalExamination[];

  @ManyToOne(() => Doctor, (doctor) => doctor.id, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @OneToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
