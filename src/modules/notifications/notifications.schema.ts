import { getBaseSchema } from '../../shared/mongo.helper';
import { INotifs } from './notifications.interface';

const NotificationsSchema = getBaseSchema<INotifs>();
NotificationsSchema.add({
  endpoint: { type: String, required: true },
  expirationTime: { type: Number, required: false },
  keys: { type: Object },
});
export { NotificationsSchema };
