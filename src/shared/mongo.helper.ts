import * as config from 'config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { SaveOptions, Schema } from 'mongoose';
import { getNow } from './time-helpers';
import { convertObject } from './helpers';

export class MongooseModuleConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: config.get('mongodb.uri'),
    };
  }
}

type DocumentSaveCallback<T> = (err: any, doc: T) => void;

export interface BaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
  softDelete(fn?: DocumentSaveCallback<this>): Promise<this>;
  softDelete(options?: SaveOptions, fn?: DocumentSaveCallback<this>): Promise<this>;
  restore(fn?: DocumentSaveCallback<this>): Promise<this>;
  restore(options?: SaveOptions, fn?: DocumentSaveCallback<this>): Promise<this>;
}

export function getBaseSchema<T extends BaseDocument>(option = {}): Schema<T> {
  const schema = new Schema<T>(
    {
      _deleted: {
        type: Boolean,
        default: false,
      },
      createdAt: Date,
      updatedAt: Date,
      deletedAt: Date,
    },
    {
      timestamps: true,
      toObject: {
        transform: (_, ret) => convertObject(ret),
      },
      toJSON: {
        transform: (_, ret) => convertObject(ret),
      },
      ...option,
    },
  );

  schema.pre<T>('save', function (next) {
    if (!this._deleted) {
      this._deleted = false;
    }
    next();
  });

  schema.methods.softDelete = function (
    options?: SaveOptions | DocumentSaveCallback<T>,
    fn?: DocumentSaveCallback<T>,
  ) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this._deleted = true;
    this.deletedAt = getNow();
    return this.save(options, fn);
  } as T['softDelete'];

  schema.methods.restore = function (
    options?: SaveOptions | DocumentSaveCallback<T>,
    fn?: DocumentSaveCallback<T>,
  ) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this._deleted = false;
    this.deletedAt = undefined;
    return this.save(options, fn);
  } as T['restore'];

  return schema;
}
