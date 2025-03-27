import { Module } from '@nestjs/common';
import { MedicalExaminationService } from './medical-examination.service';
import { MedicalExaminationController } from './medical-examination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patient/patient.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { MedicalExamination } from './medical-examination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, MedicalExamination])],
  providers: [MedicalExaminationService],
  controllers: [MedicalExaminationController]
})
export class MedicalExaminationModule {}
