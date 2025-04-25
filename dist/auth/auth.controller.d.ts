import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(authCredentialsDto: DoctorRegisterDto, req: Request): Promise<TokensDto>;
    signIn(authCredentialsDto: AuthCredentialsDto, req: Request): Promise<TokensDto>;
    refresh(refreshDto: RefreshDto): Promise<TokensDto>;
    logout(logoutDto: LogoutDto): Promise<void>;
}
