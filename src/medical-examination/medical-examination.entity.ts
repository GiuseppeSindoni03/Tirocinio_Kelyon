import { Doctor } from "src/doctor/doctor.entity";
import { Patient } from "src/patient/patient.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MedicalExamination {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column()
    motivation: string;

    @Column()
    note: string;

    @ManyToOne(() => Patient, (patient) => patient.medicalExaminations)
    patient: Patient;

    @ManyToOne(() => Doctor, (doctor) => doctor.medicalExaminations)
    doctor: Doctor;   
}