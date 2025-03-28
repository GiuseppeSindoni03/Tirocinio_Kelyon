import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {  Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Doctor } from 'src/doctor/doctor.entity';
import { User } from 'src/user/user.entity';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { Patient } from 'src/patient/patient.entity';
import * as bcrypt from 'bcryptjs';
import { addDays } from 'date-fns';


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
            throw new NotFoundException('Doctor not found');
        }

       
        const patient = this.patientRepository.create({
            weight: createInviteDto.weight,
            height: createInviteDto.height,
            bloodType: createInviteDto.bloodType,
            level: createInviteDto.level,
            sport: createInviteDto.sport,
            patologies: createInviteDto.patologies,
            medications: createInviteDto.medications,
            injuries: createInviteDto.injuries,
            doctor: doctor
        });
        
        try {
            await this.patientRepository.save(patient);

        } catch(err) {
            console.log(err);
            throw new BadRequestException('Error creating patient');
        }
        
        const invite = this.inviteRepository.create(createInviteDto);
        invite.doctor = doctor;
        invite.expiresAt = addDays(new Date(), 7);

        
        try {
            return await this.inviteRepository.save(invite);
          } catch (error) {
                console.error('Error during saving invite', error);
                throw new BadRequestException('Error during saving invite');
          }
    }

    async acceptInvite (data: AcceptInviteDto, inviteId: string): Promise<void> {
    
        const foundInvite = await this.inviteRepository.findOne({ 
            where: { id: inviteId },
            relations: ['doctor'] 
          });

        if(!foundInvite) {
            throw new NotFoundException('Invite not found');
        }
        if (foundInvite.used) {
            throw new BadRequestException('Invite already used');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);


        //3. Salvo l'utente prima di collegarlo al paziente
        let user: User;
        try {

            user = await this.userRepository.save({
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

        } catch (error) {
            if (error.code === '23505') {
              if (error.detail.includes('email')) {
                throw new ConflictException('Email already registered.');
              }
              if (error.detail.includes('cf')) {
                throw new ConflictException('CF already registered.');
              }
              if (error.detail.includes('phone')) {
                throw new ConflictException('Phone already registered.');
              }
            }
            console.error(error);
            throw new BadRequestException('Error creating user');
        }


        console.log(foundInvite)

        try{
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
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Error creating patient');
        }
        // 4. Creo il paziente associato
        

        // 5. Marca l'invito come usato
        await this.inviteRepository.update({id: foundInvite.id}, { used: true });

    }
        

}
