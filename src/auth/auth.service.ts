import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patient/patient.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jtw-payload.interface';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { User } from 'src/user/user.entity';
import { Session } from 'src/session/session.entity';
import { DeviceInfo } from './utils/deviceInfo';
import { Doctor } from 'src/doctor/doctor.entity';
import { LogoutDto } from './dto/logout.dto';
import { Role } from './utils/role-enum';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,

        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,

        private jwtService: JwtService
    ) {}

    async signUp (info: DoctorRegisterDto, deviceInfo: DeviceInfo): Promise<TokensDto> {
        const { 
            email,
            password,
            name,
            surname,
            cf,
            birthDate,
            phone,
            gender,
            medicalOffice,
            specialization,
            registrationNumber,
            orderProvince,
            orderDate,
            orderType,
        } = info;

        // 1. verifico se l'utente esiste
        const found = await this.userRepository.findOne({ where: { email, cf } });
        if (found) 
            throw new ConflictException('User already exists');


        // 2. Genero il salt e hasho la password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. creo il nuovo dottore
        const doctor = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            surname,
            cf,
            birthDate,
            phone,
            gender,
            role: Role.DOCTOR
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
        })
        


        await this.doctorRepository.save(doctorInfo);
    

        // 4. creo la nuova sessione
        const session = this.sessionRepository.create({
            user: doctor,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: deviceInfo.userAgent,
            ipAddress: deviceInfo.ipAddress
        });

        const payload: JwtPayload = { 
            userId: doctor.id,
            sessionId: session.id
         };

        // 5. genero i token
        const accessToken: string = await this.jwtService.sign(payload, {expiresIn: '15m'});
        const refreshToken: string = await this.jwtService.sign(payload, {expiresIn: '7d'});

        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        
        // 6. salvo il refreshToken hashato nella sessione
        session.refreshToken = hashedRefreshToken;

        try {
            await this.sessionRepository.save(session);
        } catch (err) {
            console.log(err);
            throw err;
        }
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async signIn(credentials: AuthCredentialsDto, deviceInfo: DeviceInfo): Promise<TokensDto> {
        const { email, password } = credentials;

        const user = await this.userRepository.findOne({ where: { email } });

        // 1. controllo che l'utenta esista e che le credenziali siano corrette
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // 2. creo la nuova sessione
        const session = this.sessionRepository.create({
            user: user,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: deviceInfo.userAgent,
            ipAddress: deviceInfo.ipAddress
        })

        await this.sessionRepository.save(session);

        const payload: JwtPayload = { 
            userId: user.id,
            sessionId: session.id
            };
        
        // 3. genero i nuovi token
        const accessToken = await this.jwtService.sign(payload, {expiresIn: '15m'});
        const refreshToken = await this.jwtService.sign(payload, {expiresIn: '7d'});

        console.log(payload)
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        
        // 4. salvo il refreshToken hashato nella sessione
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

    async refreshToken (refreshDto: RefreshDto): Promise<TokensDto> {
        const { refreshToken } = refreshDto;

        //1 . controllo che il refreshToken sia ancora valido
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(refreshToken);
        }
        catch (err) {
            throw new UnauthorizedException();
        }

        // 3. recupero la sessione
        const session =  await this.sessionRepository.findOne({
            where: {id: payload.sessionId},
            relations: ['user']
        });

        if (!session) {
            throw new UnauthorizedException();
        }
        
        // 4. controllo che il refreshToken coincidi a quello salvato nel db
        const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
        if(!isMatch ){ 
            throw new UnauthorizedException();
        }

        const newPayload: JwtPayload = {
            userId: session.user.id,
            sessionId: session.id
          };

        // 5. genero i nuovi token
        const newAccessToken = this.jwtService.sign(newPayload, {expiresIn: '15m'});
        const newRefreshToken = this.jwtService.sign(newPayload, {expiresIn: '7d'});


        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, salt);

        // 6. aggiorno il token della sessione
        session.refreshToken = hashedRefreshToken;
        
        try {
            await this.sessionRepository.save(session);
        } catch (err) {
            console.log(err);
            throw err;
        }

        return {
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken
        };
    }

    async logout (logoutDto: LogoutDto): Promise<void> {
        const {  refreshToken } = logoutDto;

        // 1. controllo che il refreshToken sia ancora valido
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verify(refreshToken);
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        } 

        // 2. recupero la sessione
        const session = await this.sessionRepository.findOne({
            where: {id: payload.sessionId}
        })

        
        if(!session )
            throw new UnauthorizedException('Session not found');

        // 3. controllo che il refreshToken coincida a quello salvato nel db
        const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
        if (!isMatch){
            throw new UnauthorizedException('Refresh token mismatch');
        }

        // 4. elimino la sessione
        try {
            await this.sessionRepository.delete(session.id)
        } catch (err) {
            console.log(err);
            throw err;
        }
 
    }


      
}