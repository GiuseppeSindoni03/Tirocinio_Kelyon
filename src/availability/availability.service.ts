import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Doctor } from 'src/doctor/doctor.entity';
import { GroupedAvailabilities } from 'src/types/grouped-availabilities';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async createAvailability(
    createAvailability: CreateAvailabilityDto,
    doctorId: string,
  ): Promise<Availability> {
    const doctor = await this.ensureDoctorExists(doctorId);

    const { startTime: newStart, endTime: newEnd } = createAvailability;

    const overlappingSlot = await this.availabilityRepository
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId: doctor.id })
      .andWhere('a.startTime < :end')
      .andWhere('a.endTime > :start')
      .setParameters({ start: newStart, end: newEnd })
      .getOne();

    console.log('start (req):', newStart);
    console.log('end (req):', newEnd);
    console.log('overlappingSlot:', overlappingSlot);

    if (overlappingSlot) {
      throw new ConflictException(
        'Time slot overlaps with an existing reservation.',
      );
    }

    const availability = this.availabilityRepository.create({
      ...createAvailability,
      doctor,
    });

    return this.availabilityRepository.save(availability);
  }

  async getAvailabilities(doctor: Doctor): Promise<GroupedAvailabilities[]> {
    const all = await this.availabilityRepository.find({
      where: { doctor },
      order: { startTime: 'ASC' },
    });

    const result: GroupedAvailabilities[] = [];

    const groupByDay = new Map<string, Availability[]>();

    for (const a of all) {
      const date = a.startTime.toISOString().split('T')[0]; // es: "2025-04-02"
      if (!groupByDay.has(date)) {
        groupByDay.set(date, []);
      }
      const slots = groupByDay.get(date);
      if (slots) {
        slots.push(a);
      }
    }

    for (const [date, slots] of groupByDay.entries()) {
      result.push({ date, slots });
    }

    return result;
  }

  async getAvailabiltiesByDate(
    doctor: Doctor,
    date: string,
  ): Promise<Availability[]> {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    return this.availabilityRepository
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId: doctor.id })
      .andWhere('a.startTime BETWEEN :start AND :end', { start, end })
      .orderBy('a.startTime', 'ASC')
      .getMany();
  }

  private async ensureDoctorExists(doctorId: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }
}
