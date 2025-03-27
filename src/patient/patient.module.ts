import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { MedicalInfo } from './medical-info.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { IsCodiceFiscaleConstraint } from 'src/auth/validators/codiceFiscale.validator';
import { MedicalExamination } from 'src/medical-examination/medical-examination.entity';
import { PatientRepository } from './patient.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient
    ])], 
  providers: [
    PatientService,
    IsCodiceFiscaleConstraint,
  ],
  controllers: [PatientController],
  exports: [],
})
export class PatientModule {}
