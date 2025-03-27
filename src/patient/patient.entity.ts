import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { MedicalInfo } from "./medical-info.entity";
import { MedicalExamination } from "src/medical-examination/medical-examination.entity";
import { Doctor } from "src/doctor/doctor.entity";

@Entity()
export class Patient{
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    cap: string;

    @Column()
    province: string;
    
    @OneToOne( () => MedicalInfo, (medicalInfo) => medicalInfo.patient, {cascade: true, nullable: true})
    @JoinColumn()
    medicalInfo?: MedicalInfo;

    @OneToMany( () => MedicalExamination, (medicalExamination) => medicalExamination.patient, {nullable: true})
    medicalExaminations: MedicalExamination[];

    @ManyToOne( () => Doctor, (doctor) => doctor.id)
    doctor: Doctor;
    
    @OneToOne(() => User, (user) => user.id, {cascade: true})
    @JoinColumn()
    user: User;
}