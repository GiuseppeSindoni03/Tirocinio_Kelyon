import { Repository } from "typeorm";
import { Patient } from "./patient.entity";
export declare class PatientService {
    private patientRepository;
    constructor(patientRepository: Repository<Patient>);
}
