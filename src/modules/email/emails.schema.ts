
import { getBaseSchema } from 'src/shared/mongo.helper';
import { IEmail } from './emails.interface';

const IEmailSchema = getBaseSchema<IEmail>();

IEmailSchema.add({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
});

export { IEmailSchema };
