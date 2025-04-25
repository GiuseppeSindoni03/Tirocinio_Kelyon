import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { User } from 'src/user/user.entity';
import { Session } from 'src/session/session.entity';
import { DeviceInfo } from './utils/deviceInfo';
import { Doctor } from 'src/doctor/doctor.entity';
import { LogoutDto } from './dto/logout.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly sessionRepository;
    private readonly doctorRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, sessionRepository: Repository<Session>, doctorRepository: Repository<Doctor>, jwtService: JwtService);
    signUp(info: DoctorRegisterDto, deviceInfo: DeviceInfo): Promise<TokensDto>;
    signIn(credentials: AuthCredentialsDto, deviceInfo: DeviceInfo): Promise<TokensDto>;
    refreshToken(refreshDto: RefreshDto): Promise<TokensDto>;
    logout(logoutDto: LogoutDto): Promise<void>;
}
