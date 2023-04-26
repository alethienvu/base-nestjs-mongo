import * as config from 'config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

export class MongooseModuleConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: config.get('mongodb.uri'),
    };
  }
}
