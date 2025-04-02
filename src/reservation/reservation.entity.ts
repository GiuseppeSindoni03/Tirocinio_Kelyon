import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationStatus } from './types/reservation-status-enum';
import { Patient } from 'src/patient/patient.entity';
import { Doctor } from 'src/doctor/doctor.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReservationStatus })
  status: ReservationStatus;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => Patient, (patient) => patient.reservations)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.reservations)
  doctor: Doctor;
}
