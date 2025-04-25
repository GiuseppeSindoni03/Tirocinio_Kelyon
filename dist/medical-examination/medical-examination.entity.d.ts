import { Doctor } from "src/doctor/doctor.entity";
import { Patient } from "src/patient/patient.entity";
export declare class MedicalExamination {
    id: string;
    date: Date;
    motivation: string;
    note: string;
    patient: Patient;
    doctor: Doctor;
}
