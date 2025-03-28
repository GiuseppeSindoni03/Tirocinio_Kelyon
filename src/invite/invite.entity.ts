import { Gender } from "src/auth/dto/gender-enum";
import { Doctor } from "src/doctor/doctor.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invite {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    email: string;

    @Column()
    cf: string;

    @Column( { type: 'date' } )
    birthDate: Date;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    cap: string;

    @Column()
    province: string;

    @Column({ default: false })
    used: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @ManyToOne(type => Doctor, (doctor) => doctor.id, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    doctor: Doctor;

}