import { Patient } from "./patient.entity";
import { Repository } from "typeorm";
export declare class PatientRepository extends Repository<Patient> {
    private readonly repository;
    constructor(repository: Repository<Patient>);
}
