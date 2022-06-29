import { Request } from 'express';
import { IUser } from '../../models/userModel';

export interface RequestWithUser extends Request {
  user: IUser;
}

export interface DataStoredInToken {
  id: string;
}
