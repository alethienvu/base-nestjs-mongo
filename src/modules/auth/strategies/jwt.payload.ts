import { UserRole } from '../../../shared/enum/users.const';
import { JwtPayload } from 'jsonwebtoken';

export class IJwtPayload implements JwtPayload {
  userId: string;
  role: UserRole;
}
