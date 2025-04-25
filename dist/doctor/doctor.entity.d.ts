import { User } from "src/user/user.entity";
import { MedicalExamination } from "src/medical-examination/medical-examination.entity";
export declare class Doctor {
    id: string;
    specialization: string;
    medicalOffice: string;
    registrationNumber: string;
    orderProvince: string;
    orderDate: Date;
    orderType: string;
    medicalExaminations: MedicalExamination[];
    user: User;
}
