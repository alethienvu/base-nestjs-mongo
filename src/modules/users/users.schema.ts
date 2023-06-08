import { getBaseSchema } from '../../shared/mongo.helper';
import { IAvatar, IUser } from './users.interface';

const UsersSchema = getBaseSchema<IUser>();
UsersSchema.add({
  email: { type: String, required: true },
  address: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  phone: { type: String },
  role: { type: String, required: true },
  status: { type: String, required: true },
  password: { type: String, select: false },
});

const AvatarSchema = getBaseSchema<IAvatar>();
AvatarSchema.add({
  fileName: { type: String, required: true },
  type: { type: String, required: true },
  stream: { type: Buffer, required: true },
  userId: { type: String, required: true },
});

export { UsersSchema, AvatarSchema };
