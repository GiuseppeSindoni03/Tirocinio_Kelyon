import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Doctor } from 'src/doctor/doctor.entity';

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

    try {
      await this.checkAvailabilityExists(
        doctor,
        createAvailability.startTime,
        createAvailability.endTime,
      );
    } catch (error) {
      console.log(error);
    }

    const availability = this.availabilityRepository.create({
      ...createAvailability,
      doctor,
    });

    return this.availabilityRepository.save(availability);
  }

  async getAvailabilities(doctor: Doctor): Promise<Availability[]> {
    return this.availabilityRepository.find({ where: { doctor } });
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

  private async checkAvailabilityExists(
    doctor: Doctor,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const exists = await this.availabilityRepository.findOne({
      where: { doctor, startTime, endTime },
    });

    if (exists) {
      throw new ConflictException('Availability already exists');
    }
  }
}
