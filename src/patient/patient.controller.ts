import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('patient')
@UseGuards(AuthGuard('jwt'))
export class PatientController {
  constructor(private patientService: PatientService) {}
}
