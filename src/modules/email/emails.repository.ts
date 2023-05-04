import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, QueryOptions, SaveOptions } from 'mongoose';
import { DbModel } from '../../shared/constants';
import { IEmail } from './emails.interface';

export interface CursorOptions {
  batchSize?: number;
  sort?: any;
}
@Injectable()
export class EmailRepository implements OnApplicationBootstrap {
  constructor(@InjectModel(DbModel.Emails) private readonly model: Model<IEmail>) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }

  async createCollection(): Promise<void> {
    if (!(await this.isCollectionExists())) {
      await this.model.createCollection();
    }
  }

  private async isCollectionExists(): Promise<boolean> {
    const result = await this.model.db.db
      .listCollections({ name: this.model.collection.collectionName })
      .next();

    return !!result;
  }

  async findAll(findParams, option?: QueryOptions, sort?: any): Promise<IEmail[]> {
    const query = this.model.find(findParams, {}, option);

    if (sort && Object.keys(sort).length > 0) {
      query.sort(sort);
    }
    return query.exec();
  }

  async count(conditions: any): Promise<number> {
    return this.model.countDocuments(conditions);
  }

  async save(docs: object | object[], options?: SaveOptions) {
    if (Array.isArray(docs)) {
      const result: object[] = [];
      for (const doc of docs) {
        result.push(await new this.model(doc).save(options));
      }
      return result;
    }
    return new this.model(docs).save(options);
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async updateById(id: string, doc: any): Promise<IEmail> {
    const newDocument = Object.assign(await this.findById(id), doc);
    return new this.model(newDocument).save();
  }

  async findWithCursor(conditions, options?: QueryOptions): Promise<any> {
    return this.model.find(conditions).sort(options.sort).cursor({ batchSize: options?.batchSize });
  }

  async withTransaction<U>(fn: (session: ClientSession) => Promise<U>): Promise<U> {
    const session = await this.model.db.startSession();
    let result: U;
    try {
      await session.withTransaction(async (ses) => {
        result = await fn(ses);
      });
      return result;
    } finally {
      session.endSession();
    }
  }
}
