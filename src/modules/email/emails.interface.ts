import { BaseDocument } from '../../shared/mongo.helper';
import { EmailStatus } from './emails.enum';

export interface IEmail extends BaseDocument {
  userId: string;
  email: string;
  status: EmailStatus;
}
