import { Injectable } from "@nestjs/common";
import { PatientInfoDto } from "./dto/patient-info.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PatientRepository } from "./patient.repository";
import { Repository } from "typeorm";
import { Patient } from "./patient.entity";

@Injectable()
export class PatientService {

    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
    ) {}

    async postPatientInfo(patientInfo: PatientInfoDto, user) {

        const patient = this.patientRepository.create(patientInfo);
        
        patient.user = user;

        try {
            await this.patientRepository.save(patient);
            return patientInfo;
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

}