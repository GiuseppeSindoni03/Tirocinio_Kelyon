import { Repository } from "typeorm";
import { Doctor } from "./doctor.entity";
export declare class DoctorRepository extends Repository<Doctor> {
    private readonly repository;
    constructor(repository: Repository<Doctor>);
}
