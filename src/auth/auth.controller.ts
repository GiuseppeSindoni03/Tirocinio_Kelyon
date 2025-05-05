import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshDto } from './dto/refresh.dto';
import { DeviceInfo } from './utils/deviceInfo';
import { AuthGuard } from '@nestjs/passport';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentialsDto: DoctorRegisterDto,
    @Req() req: Request,
  ): Promise<TokensDto> {
    return this.authService.signUp(authCredentialsDto, this.getDeviceInfo(req));
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Req() req: Request,
  ): Promise<TokensDto> {
    return this.authService.signIn(authCredentialsDto, this.getDeviceInfo(req));
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt'))
  refresh(@Body() refreshDto: RefreshDto): Promise<TokensDto> {
    return this.authService.refreshToken(refreshDto);
  }

  @Post('/logout')
  logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.authService.logout(logoutDto);
  }

  private getDeviceInfo(req: Request): DeviceInfo {
    return {
      userAgent: req.headers['user-agent'] || 'Unknown',
      ipAddress:
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        'Unknown',
    };
  }
}
