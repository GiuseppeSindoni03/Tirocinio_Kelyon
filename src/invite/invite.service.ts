import { Injectable } from '@nestjs/common';
import {  Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Doctor } from 'src/doctor/doctor.entity';
import { User } from 'src/user/user.entity';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { Patient } from 'src/patient/patient.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class InviteService {

    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: Repository<Invite>,
    
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>
    ) {

    }

    async createInvite (createInviteDto: CreateInviteDto, user: User): Promise<Invite> {

        const doctor = await this.doctorRepository.findOne({ 
            where: { user: user },
            relations: ['user']  
          });
          

        if(!doctor) {
            throw new Error('Doctor not found');
        }

        const invite = this.inviteRepository.create(createInviteDto);
        invite.doctor = doctor;
        invite.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 giorni


        console.log('Doctor:' + doctor)
        console.log(invite.doctor)

        
        return this.inviteRepository.save(invite);
    }

    async acceptInvite (acceptInviteDto: AcceptInviteDto, invite: string): Promise<void> {
        const {password} = acceptInviteDto;
        
        const foundInvite = await this.inviteRepository.findOne({ 
            where: { id: invite },
            relations: ['doctor'] 
          });
        if(!foundInvite) {
            throw new Error('Invite not found');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);


        //3. Salvo l'utente prima di collegarlo al paziente
        const user = await this.userRepository.save({
            name: foundInvite.name,
            surname: foundInvite.surname,
            email: foundInvite.email,
            password: hashedPassword,
            cf: foundInvite.cf,
            birthDate: foundInvite.birthDate,
            gender: foundInvite.gender,
            phone: foundInvite.phone,
            address: foundInvite.address,
            city: foundInvite.city,
            cap: foundInvite.cap,
            province: foundInvite.province,
            role: 'PATIENT', 
        }
        );

    //const user = await  this.userRepository.findOne({ where: { email: foundInvite.email } });

        if(!user) {
            throw new Error('User not found');
        }

        console.log(foundInvite)
        // 4. Creo il paziente associato
        const patient = this.patientRepository.create({
            weight: foundInvite.weight,
            height: foundInvite.height,
            bloodType: foundInvite.bloodType,
            level: foundInvite.level,
            sport: foundInvite.sport,
            patologies: foundInvite.patologies,
            medications: foundInvite.medications,
            injuries: foundInvite.injuries,
            user: user,
            doctor: foundInvite.doctor
        });
        

        await this.patientRepository.save(patient);


        console.log('foundInvite ID:', foundInvite.id);

        // 5. Marca l'invito come usato
        await this.inviteRepository.update({id: foundInvite.id}, { used: true });

    }
        

}
