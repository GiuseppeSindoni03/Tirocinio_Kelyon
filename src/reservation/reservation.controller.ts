import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetSlot } from './dto/get-slot.dto';

@Controller('reservations')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @Roles('DOCTOR', 'ADMIN')
  async getReservations(@Req() req: RequestWithUser) {
    const user = req.user;

    if (!user.doctor) {
      throw new HttpException('You are not a doctor', HttpStatus.FORBIDDEN);
    }

    return this.reservationService.getReservations(user.doctor);
  }

  @Post()
  @Roles('PATIENT', 'ADMIN')
  async createReservation(
    @Req() req: RequestWithUser,
    @Body() body: CreateReservationDto,
  ) {
    const patient = req.user.patient;
    if (!patient) {
      throw new UnauthorizedException(
        'Solo i pazienti possono fare una richiesta di prenotazione.',
      );
    }

    const doctor = patient.doctor;

    if (!doctor) {
      throw new HttpException('Dottore del paziente non esiste', 400);
    }

    return this.reservationService.createReservation(doctor, patient, body);
  }

  @Patch('/:reservationId/confirm')
  @Roles('DOCTOR', 'ADMIN')
  async acceptReservation(@Req() req: RequestWithUser) {
    const { reservationId } = req.params;

    const doctor = req.user.doctor;

    if (!doctor) return new HttpException('Purtroppo non sei un dottore', 401);

    return this.reservationService.acceptReservation(reservationId, doctor);
  }

  @Patch('/:reservationId/reject')
  @Roles('DOCTOR', 'ADMIN')
  async rejectReservation(@Req() req: RequestWithUser) {
    const { reservationId } = req.params;

    const doctor = req.user.doctor;

    if (!doctor) return new HttpException('Purtroppo non sei un dottore', 401);

    return this.reservationService.declineReservation(reservationId, doctor);
  }

  @Get(':doctorId/slots')
  @Roles('PATIENT', 'ADMIN')
  async getSlots(@Req() req: RequestWithUser, @Body() body: GetSlot) {
    const patient = req.user.patient;

    if (!patient) throw new HttpException('Purtroppo non sei un paziente', 400);

    return this.reservationService.getReservationSlots(patient, body);
  }
}
