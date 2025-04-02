import { Availability } from 'src/availability/availability.entity';

export interface GroupedAvailabilities {
  date: string;

  slots: Availability[];
}
