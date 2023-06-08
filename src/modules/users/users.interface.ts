import { Gender, UserRole, UserStatus } from '../../shared/enum/users.const';
import { BaseDocument } from '../../shared/mongo.helper';

export interface IAvatarBase {
  fileName: string;
  type: string;
  stream: any;
  userId: string;
}
export interface IUserBase {
  id: string;
  email: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  gender: Gender;
  dateOfBirth: Date;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  password: string;
}
export interface IUser extends BaseDocument, IUserBase {}
export interface IAvatar extends BaseDocument, IAvatarBase {}
