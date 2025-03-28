import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./patient.entity";

@Injectable()
export class PatientService {

    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
    ) {}

   

}