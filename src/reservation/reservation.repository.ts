import { Repository } from 'typeorm';
import { Reservetion } from './reservation.entity';

export class ReservationRepository extends Repository<Reservetion> {
  constructor(private readonly repository: Repository<Reservetion>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
