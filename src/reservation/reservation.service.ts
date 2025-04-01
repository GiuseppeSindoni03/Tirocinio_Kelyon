import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservetion } from './reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  public constructor(
    @InjectRepository(Reservetion)
    private readonly reservationRepository: Repository<Reservetion>,
  ) {}
}
