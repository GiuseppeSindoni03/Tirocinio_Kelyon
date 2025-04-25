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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/user.entity");
const session_entity_1 = require("../session/session.entity");
const doctor_entity_1 = require("../doctor/doctor.entity");
const role_enum_1 = require("./utils/role-enum");
let AuthService = class AuthService {
    userRepository;
    sessionRepository;
    doctorRepository;
    jwtService;
    constructor(userRepository, sessionRepository, doctorRepository, jwtService) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.doctorRepository = doctorRepository;
        this.jwtService = jwtService;
    }
    async signUp(info, deviceInfo) {
        const { email, password, name, surname, cf, birthDate, phone, gender, address, city, cap, province, medicalOffice, specialization, registrationNumber, orderProvince, orderDate, orderType, } = info;
        const found = await this.userRepository.findOne({ where: { email, cf } });
        if (found)
            throw new common_1.ConflictException('User already exists');
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const doctor = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            surname,
            cf,
            birthDate,
            phone,
            gender,
            address,
            city,
            cap,
            province,
            role: role_enum_1.Role.DOCTOR
        });
        await this.userRepository.save(doctor);
        const doctorInfo = this.doctorRepository.create({
            medicalOffice,
            registrationNumber,
            orderProvince,
            orderDate,
            orderType,
            specialization,
            user: doctor
        });
        await this.doctorRepository.save(doctorInfo);
        const session = this.sessionRepository.create({
            user: doctor,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: deviceInfo.userAgent,
            ipAddress: deviceInfo.ipAddress
        });
        const payload = {
            userId: doctor.id,
            sessionId: session.id
        };
        const accessToken = await this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = await this.jwtService.sign(payload, { expiresIn: '7d' });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        session.refreshToken = hashedRefreshToken;
        try {
            await this.sessionRepository.save(session);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
    async signIn(credentials, deviceInfo) {
        const { email, password } = credentials;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const session = this.sessionRepository.create({
            user: user,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: deviceInfo.userAgent,
            ipAddress: deviceInfo.ipAddress
        });
        await this.sessionRepository.save(session);
        const payload = {
            userId: user.id,
            sessionId: session.id
        };
        const accessToken = await this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = await this.jwtService.sign(payload, { expiresIn: '7d' });
        console.log(payload);
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        session.refreshToken = hashedRefreshToken;
        try {
            await this.sessionRepository.save(session);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
    async refreshToken(refreshDto) {
        const { refreshToken } = refreshDto;
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken);
        }
        catch (err) {
            throw new common_1.UnauthorizedException();
        }
        const session = await this.sessionRepository.findOne({
            where: { id: payload.sessionId },
            relations: ['user']
        });
        if (!session) {
            throw new common_1.UnauthorizedException();
        }
        const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
        if (!isMatch) {
            throw new common_1.UnauthorizedException();
        }
        const newPayload = {
            userId: session.user.id,
            sessionId: session.id
        };
        const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, salt);
        session.refreshToken = hashedRefreshToken;
        try {
            await this.sessionRepository.save(session);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
    async logout(logoutDto) {
        const { refreshToken } = logoutDto;
        let payload;
        try {
            payload = await this.jwtService.verify(refreshToken);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const session = await this.sessionRepository.findOne({
            where: { id: payload.sessionId }
        });
        if (!session)
            throw new common_1.UnauthorizedException('Session not found');
        const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Refresh token mismatch');
        }
        try {
            await this.sessionRepository.delete(session.id);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(2, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map