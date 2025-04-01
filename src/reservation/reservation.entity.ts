import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from './types/reservation-status-enum';
import { Patient } from 'src/patient/patient.entity';

@Entity()
export class Reservetion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReservationStatus })
  status: ReservationStatus;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => Patient, (patient) => patient.id)
  patient: Patient;
}
