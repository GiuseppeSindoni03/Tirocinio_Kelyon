import { User } from 'src/user/user.entity';
import { MedicalExamination } from 'src/medical-examination/medical-examination.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Availability } from 'src/availability/availability.entity';
import { Reservation } from 'src/reservation/reservation.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialization: string;

  @Column()
  medicalOffice: string;

  @Column()
  registrationNumber: string;

  @Column()
  orderProvince: string;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column()
  orderType: string;

  @OneToMany(
    () => MedicalExamination,
    (medicalExamination) => medicalExamination.doctor,
  )
  medicalExaminations: MedicalExamination[];

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Availability, (availability) => availability.doctor)
  availabilities: Availability[];

  @OneToMany(() => Reservation, (reservation) => reservation.doctor)
  reservations: Reservation[];
}
