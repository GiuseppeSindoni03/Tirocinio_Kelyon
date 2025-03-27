import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from "./patient.entity";

@Entity()
export class MedicalInfo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float'})
    weight: number;

    @Column({ type: 'float'})
    height: number;

    @Column()
    bloodType: string;

    @Column()
    level: string;

    @Column()
    sport: string;

    @Column("text", {array: true})
    patologies: string[];

    @Column("text", {array: true})
    medications: string[];

    @Column("text", {array: true})
    injuries: string[];  
    
    @Column()
    role: string;

    
    @OneToOne(() => Patient, (patient) => patient.medicalInfo)
    patient: Patient;

}