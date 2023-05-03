import { UserRole } from '../../../shared/enum/users.const';

export class JwtPayload {
  userId: string;
  role: UserRole;
}
