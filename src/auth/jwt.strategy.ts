import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './dto/jtw-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Session } from 'src/session/session.entity';
import { Repository } from 'typeorm';
import { UserItem } from 'src/types/userItem';
import { Doctor } from 'src/doctor/doctor.entity';
import { Patient } from 'src/patient/patient.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { sessionId } = payload;

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      await this.sessionRepository.delete(session.id); // cleanup
      throw new UnauthorizedException('Session expired');
    }

    const user: UserItem = session.user;

    if (user.role === 'DOCTOR') {
      const doctor = await this.doctorRepository.findOne({
        where: { user: user },
        relations: ['user'],
      });

      if (doctor) {
        user.doctor = doctor;
      }
    } else if ((user.role = 'PATIENT')) {
      const patient = await this.patientRepository.findOne({
        where: { user: user },
        relations: ['doctor', 'user'],
      });

      if (patient) {
        user.patient = patient;
      }
    }

    console.log(user);

    return user;
  }
}
