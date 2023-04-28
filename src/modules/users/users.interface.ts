import { UserRole, UserStatus } from 'src/shared/enum/users.const';
import { BaseDocument } from 'src/shared/mongo.helper';

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

export interface IUserBaseInfo {
  id: string;
  email: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
