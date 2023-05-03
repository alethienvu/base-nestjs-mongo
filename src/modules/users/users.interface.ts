import { UserRole, UserStatus } from '../../shared/enum/users.const';
import { BaseDocument } from '../../shared/mongo.helper';

export interface IUserBase {
  id: string;
  email: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  password: string;
}
export interface IUser extends BaseDocument, IUserBase {}
