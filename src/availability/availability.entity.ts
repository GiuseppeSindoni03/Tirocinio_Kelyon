import { Doctor } from 'src/doctor/doctor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  @Unique(['doctor', 'startTime'])
  startTime: Date;

  @Column({ type: 'timestamp' })
  @Unique(['doctor', 'endTime'])
  endTime: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.availabilities, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;
}
