import { Body, Controller, Post, Req } from '@nestjs/common';
import { PatientInfoDto } from './dto/patient-info.dto';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {

    constructor (
        private patientService: PatientService,
    ) {}

    // @Post('user-info')
    // async postPatientInfo(@Body() patientInfo: PatientInfoDto, @Req() req: Request): Promise<PatientInfoDto> {
        
        
    //     //return this.patientService.postPatientInfo(patientInfo);
    // }
}
