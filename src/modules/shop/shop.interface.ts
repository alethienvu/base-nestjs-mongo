import { ShopStatus } from 'src/shared/enum/shop.const';
import { BaseDocument } from '../../shared/mongo.helper';

export interface IShopBase {
  id: string;
  name: string;
  userId: string;
  status: ShopStatus;
  address?: string;
  avatar?: string;
}
export interface IShop extends BaseDocument, IShopBase {}
