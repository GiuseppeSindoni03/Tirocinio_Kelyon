import { IsISO8601, IsNotEmpty } from 'class-validator';
import { HasMinimumDuration } from 'src/validators/has-minimum-duration';
import { IsSameDay } from 'src/validators/IsSameDayAndValidRange';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsISO8601()
  startTime: Date;

  @IsNotEmpty()
  @IsISO8601()
  endTime: Date;

  @IsSameDay()
  @HasMinimumDuration(30)
  checkTimeRange: boolean;
}
