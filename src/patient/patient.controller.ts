import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/types/request-with-user.interface';

@Controller('patient')
@UseGuards(AuthGuard('jwt'))
export class PatientController {

    constructor (
        private patientService: PatientService,
    ) {}

    
}
