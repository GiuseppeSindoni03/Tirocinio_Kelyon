import { Gender } from "src/auth/dto/gender-enum";
import { Doctor } from "src/doctor/doctor.entity";
export declare class Invite {
    id: string;
    name: string;
    surname: string;
    email: string;
    cf: string;
    birthDate: Date;
    gender: Gender;
    phone: string;
    address: string;
    city: string;
    cap: string;
    province: string;
    weight: number;
    height: number;
    bloodType: string;
    level: string;
    sport: string;
    patologies: string[];
    medications: string[];
    injuries: string[];
    used: boolean;
    createdAt: Date;
    expiresAt: Date;
    doctor: Doctor;
}
