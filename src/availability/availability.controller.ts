import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RequestWithUser } from 'src/types/request-with-user.interface';

@Controller('doctor/availability')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @Roles('DOCTOR', 'ADMIN')
  async createAvailability(
    @Body() body: CreateAvailabilityDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;

    if (!user.doctor) {
      throw new HttpException('You are not a doctor', HttpStatus.FORBIDDEN);
    }

    return this.availabilityService.createAvailability(body, user.doctor.id);
  }

  @Get()
  @Roles('DOCTOR', 'ADMIN')
  async getAvailabilities(@Req() req: RequestWithUser) {
    const id = req.user.id;
    const user = req.user;

    if (!user.doctor) {
      throw new HttpException('You are not a doctor', HttpStatus.FORBIDDEN);
    }

    return this.availabilityService.getAvailabilities(user.doctor);
  }

  @Get('/date')
  @Roles('DOCTOR', 'ADMIN')
  async getAvailabilitiesByDate(
    @Body() body: { date: string },
    @Req() req: RequestWithUser,
  ) {
    const id = req.user.id;
    const user = req.user;

    if (!user.doctor) {
      throw new HttpException('You are not a doctor', HttpStatus.FORBIDDEN);
    }

    return this.availabilityService.getAvailabiltiesByDate(
      user.doctor,
      body.date,
    );
  }
}
