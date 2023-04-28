import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ClientSession, Model, QueryOptions, SaveOptions } from 'mongoose';
import { DbModel } from '../../shared/constants';
import { IUser } from './users.interface';

@Injectable()
export class UsersRepository implements OnApplicationBootstrap {
  constructor(@InjectModel(DbModel.Users) private readonly model: Model<IUser>) {}

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

  async findAll(findParams, option?: QueryOptions, sort?: any): Promise<IUser[]> {
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

  async create(docs: object, options?: SaveOptions) {
    return new this.model(docs).save(options);
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async findOne(findParams) {
    return this.model.findOne(findParams).exec();
  }

  async findOneWithPass(findParams) {
    return this.model.findOne(findParams).select('+password').exec();
  }

  async updateOne(conditions, doc: any, options?: QueryOptions): Promise<IUser> {
    return this.model.findOneAndUpdate(conditions, doc, options);
  }

  async updateById(id: any, doc: any) {
    return this.model.updateOne({ _id: new ObjectId(id) }, doc);
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
