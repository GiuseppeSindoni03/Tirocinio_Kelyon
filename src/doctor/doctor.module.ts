import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Patient } from 'src/patient/patient.entity';
import { MedicalExamination } from 'src/medical-examination/medical-examination.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([
    Patient, 
    MedicalExamination
  ])],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {

}
