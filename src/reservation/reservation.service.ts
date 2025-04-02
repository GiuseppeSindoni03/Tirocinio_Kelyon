import {
  ConflictException,
  HttpCode,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Repository } from 'typeorm';
import { ReservationStatus } from './types/reservation-status-enum'; // Adjust the path if necessary
import { Doctor } from 'src/doctor/doctor.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Patient } from 'src/patient/patient.entity';
import { Availability } from 'src/availability/availability.entity';
import { GetSlot } from './dto/get-slot.dto';

@Injectable()
export class ReservationService {
  public constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async getReservations(
    doctor: Doctor,
  ): Promise<{ date: string; reservations: Reservation[] }[]> {
    const reservations: Reservation[] = await this.reservationRepository
      .createQueryBuilder('r')
      .where({ doctor })
      .orderBy('r.startDate', 'ASC')
      .getMany();

    const groupedReservations = new Map<string, Reservation[]>();

    reservations.forEach((reservation) => {
      const date = reservation.startDate.toISOString().split('T')[0];

      if (!groupedReservations.has(date)) {
        groupedReservations.set(date, []);
      }

      groupedReservations.get(date)!.push(reservation);
    });

    const result: { date: string; reservations: Reservation[] }[] = [];

    for (const [date, reservations] of groupedReservations.entries()) {
      result.push({ date, reservations });
    }

    // Ordina anche i gruppi per data, se vuoi
    result.sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  async getReservationsByDay(
    doctorId: string,
    date: string,
  ): Promise<Reservation[]> {
    const reservations = await this.reservationRepository
      .createQueryBuilder('r')
      .where('r.doctorId = :doctorId', { doctorId })
      .orderBy('r.startDate', 'ASC')
      .getMany();

    const result: Reservation[] = [];

    reservations.forEach((reservation) => {
      const day = reservation.startDate.toISOString().split('T')[0];

      if (day === date) {
        result.push(reservation);
      }
    });

    return result;
  }

  async createReservation(
    doctor: Doctor,
    patient: Patient,
    createReservationDto: CreateReservationDto,
  ) {
    const { startTime, endTime } = createReservationDto;

    const found = await this.reservationRepository.findOne({
      where: {
        doctor,
        startDate: startTime,
        status: ReservationStatus.CONFIRMED,
      },
    });

    if (found) {
      throw new ConflictException('Reservation already exists');
    }

    const validAvailability = await this.availabilityRepository
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId: doctor.id })
      .andWhere('a.startTime <= :startTime')
      .andWhere('a.endTime >= :endTime')
      .setParameters({ startTime, endTime })
      .getOne();

    if (!validAvailability) {
      throw new HttpException(
        'The reservation must be within an available time slot for the doctor.',
        400,
      );
    }

    const reservation = this.reservationRepository.create({
      startDate: startTime,
      endDate: endTime,
      doctor,
      patient,
      status: ReservationStatus.PENDING,
      createdAt: new Date(),
    });

    return this.reservationRepository.save(reservation);
  }

  async acceptReservation(reservationId: string, doctor: Doctor) {
    const reservation = await this.reservationRepository
      .createQueryBuilder('r')
      .where('r.id = :reservationId', { reservationId })
      .andWhere('r.doctorId = :doctorId', { doctorId: doctor.id })
      .andWhere('r.status = :reservationStatus', {
        reservationStatus: ReservationStatus.PENDING,
      })
      .getOne();

    if (!reservation) throw new HttpException("Reservation doesn't exist", 400);

    reservation.status = ReservationStatus.CONFIRMED;

    return await this.reservationRepository.save(reservation);
  }

  async declineReservation(reservationId: string, doctor: Doctor) {
    const reservation = await this.reservationRepository
      .createQueryBuilder('r')
      .where('r.id = :reservationId', { reservationId })
      .andWhere('r.doctorId = :doctorId', { doctorId: doctor.id })
      .andWhere('r.status = :reservationStatus', {
        reservationStatus: ReservationStatus.PENDING,
      })
      .getOne();

    if (!reservation) throw new HttpException("Reservation doesn't exist", 400);

    reservation.status = ReservationStatus.DECLINED;

    return await this.reservationRepository.save(reservation);
  }

  async getReservationSlots(
    patient: Patient,
    dateDto: GetSlot,
  ): Promise<{ startTime: Date; endTime: Date }[]> {
    const date = dateDto.date.toString().split('T')[0]; // Es: "2025-04-02"

    // 1. Prendi le disponibilità del dottore in quel giorno
    const availabilities = await this.availabilityRepository
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId: patient.doctor.id })
      .andWhere('DATE(a.startTime) = :date', { date })
      .getMany();

    if (availabilities.length === 0) {
      throw new HttpException(
        'Nessuna disponibilità trovata per questa data',
        404,
      );
    }

    // 2. Riutilizza il tuo metodo già pronto!
    const reservations = await this.getReservationsByDay(
      patient.doctor.id,
      date,
    );

    // 3. Filtra solo quelle confermate
    const confirmed = reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED,
    );

    const occupiedSlots = confirmed.map((r) => ({
      start: r.startDate.getTime(),
      end: r.endDate.getTime(),
    }));

    const availableSlots: { startTime: Date; endTime: Date }[] = [];

    for (const availability of availabilities) {
      let slotStart = new Date(availability.startTime);
      const slotEnd = new Date(availability.endTime);

      while (slotStart.getTime() + 30 * 60000 <= slotEnd.getTime()) {
        const slot = {
          startTime: new Date(slotStart),
          endTime: new Date(slotStart.getTime() + 30 * 60000),
        };

        const overlaps = occupiedSlots.some(
          (res) =>
            slot.startTime.getTime() < res.end &&
            slot.endTime.getTime() > res.start,
        );

        if (!overlaps) {
          availableSlots.push(slot);
        }

        slotStart = new Date(slotStart.getTime() + 30 * 60000);
      }
    }

    return availableSlots;
  }
}
