import { User } from 'src/user/user.entity';
import { MedicalExamination } from 'src/medical-examination/medical-examination.entity';
import { Doctor } from 'src/doctor/doctor.entity';
export declare class Patient {
    id: string;
    weight: number;
    height: number;
    bloodType: string;
    level: string;
    sport: string;
    patologies: string[];
    medications: string[];
    injuries: string[];
    medicalExaminations: MedicalExamination[];
    doctor: Doctor;
    user: User;
}
