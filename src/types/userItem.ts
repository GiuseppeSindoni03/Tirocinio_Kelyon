import { Doctor } from 'src/doctor/doctor.entity';
import { User } from 'src/user/user.entity';

export class UserItem extends User {
  doctor?: Doctor;
}
