"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const invite_entity_1 = require("./invite.entity");
const typeorm_2 = require("@nestjs/typeorm");
const doctor_entity_1 = require("../doctor/doctor.entity");
const user_entity_1 = require("../user/user.entity");
const patient_entity_1 = require("../patient/patient.entity");
const bcrypt = require("bcryptjs");
let InviteService = class InviteService {
    inviteRepository;
    doctorRepository;
    userRepository;
    patientRepository;
    constructor(inviteRepository, doctorRepository, userRepository, patientRepository) {
        this.inviteRepository = inviteRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }
    async createInvite(createInviteDto, user) {
        const doctor = await this.doctorRepository.findOne({
            where: { user: user },
            relations: ['user']
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        const invite = this.inviteRepository.create(createInviteDto);
        invite.doctor = doctor;
        invite.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        console.log('Doctor:' + doctor);
        console.log(invite.doctor);
        return this.inviteRepository.save(invite);
    }
    async acceptInvite(acceptInviteDto, invite) {
        const { password } = acceptInviteDto;
        const foundInvite = await this.inviteRepository.findOne({
            where: { id: invite },
            relations: ['doctor']
        });
        if (!foundInvite) {
            throw new Error('Invite not found');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
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
        });
        if (!user) {
            throw new Error('User not found');
        }
        console.log(foundInvite);
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
        await this.inviteRepository.update({ id: foundInvite.id }, { used: true });
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(invite_entity_1.Invite)),
    __param(1, (0, typeorm_2.InjectRepository)(doctor_entity_1.Doctor)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_2.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], InviteService);
//# sourceMappingURL=invite.service.js.map