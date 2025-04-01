import { Request } from 'express';
import { UserItem } from './userItem';

export interface RequestWithUser extends Request {
  user: UserItem;
}
