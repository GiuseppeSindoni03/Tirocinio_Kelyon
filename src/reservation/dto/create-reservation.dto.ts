import { IsDate, IsISO8601, IsNotEmpty } from 'class-validator';
import { HasDuration } from 'src/validators/has-duration.validator';
import { IsSameDay } from 'src/validators/IsSameDayAndValidRange';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsISO8601()
  startTime: Date;

  @IsNotEmpty()
  @IsISO8601()
  endTime: Date;

  @IsSameDay()
  @HasDuration(30)
  checkTimeRange: boolean;
}
