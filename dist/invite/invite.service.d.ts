import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Doctor } from 'src/doctor/doctor.entity';
import { User } from 'src/user/user.entity';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { Patient } from 'src/patient/patient.entity';
export declare class InviteService {
    private readonly inviteRepository;
    private readonly doctorRepository;
    private readonly userRepository;
    private readonly patientRepository;
    constructor(inviteRepository: Repository<Invite>, doctorRepository: Repository<Doctor>, userRepository: Repository<User>, patientRepository: Repository<Patient>);
    createInvite(createInviteDto: CreateInviteDto, user: User): Promise<Invite>;
    acceptInvite(acceptInviteDto: AcceptInviteDto, invite: string): Promise<void>;
}
