import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {User} from '../user/user.entity'
import { Session } from '../session/session.entity';
import { Doctor } from 'src/doctor/doctor.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      Doctor,
      Session
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
        expiresIn: 3600,
      }
      })
      
    })
  ],
  providers: [ AuthService, JwtStrategy], 
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule], 
})
export class AuthModule {}