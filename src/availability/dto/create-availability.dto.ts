import { IsDate, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsISO8601()
  startTime: Date;

  @IsNotEmpty()
  @IsISO8601()
  endTime: Date;
}
