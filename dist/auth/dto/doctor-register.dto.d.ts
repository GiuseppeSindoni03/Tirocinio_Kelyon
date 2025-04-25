import { Gender } from "./gender-enum";
export declare class DoctorRegisterDto {
    name: string;
    surname: string;
    email: string;
    password: string;
    cf: string;
    birthDate: Date;
    phone: string;
    gender: Gender;
    address: string;
    city: string;
    cap: string;
    province: string;
    medicalOffice: string;
    registrationNumber: string;
    orderProvince: string;
    orderDate: Date;
    orderType: string;
    specialization: string;
}
