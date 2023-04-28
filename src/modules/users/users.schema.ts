import { getBaseSchema } from 'src/shared/mongo.helper';
import { IUser } from './users.interface';

const UsersSchema = getBaseSchema<IUser>();
UsersSchema.add({
  id: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  role: { type: String, required: true },
  status: { type: String, required: true },
  password: {type: String}
});
export { UsersSchema };
