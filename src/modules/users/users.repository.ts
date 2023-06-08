import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ClientSession, Model, QueryOptions, SaveOptions } from 'mongoose';
import { DbModel } from '../../shared/constants';
import { IAvatar, IUser } from './users.interface';
import { buildFindParamsObject } from 'src/shared/data.prettifier';

@Injectable()
export class UsersRepository implements OnApplicationBootstrap {
  constructor(
    @InjectModel(DbModel.Users) private readonly model: Model<IUser>,
    @InjectModel(DbModel.Avatars) private readonly avatar: Model<IAvatar>,
  ) {}

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
    const param = buildFindParamsObject(findParams);
    const query = this.model.find(param, {}, option);

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

  async saveAvatar(docs: object | object[], options?: SaveOptions) {
    if (Array.isArray(docs)) {
      const result: object[] = [];
      for (const doc of docs) {
        result.push(await new this.avatar(doc).save(options));
      }
      return result;
    }
    return new this.avatar(docs).save(options);
  }

  async findById(id: string) {
    return this.model.findById({ _id: new ObjectId(id) }).exec();
  }

  async findAvatarByUserId(userId: string) {
    return this.avatar.findOne({ userId }).exec();
  }

  async deleteOneAvatar(id: string) {
    return this.avatar.deleteOne({ _id: new ObjectId(id) }).exec();
  }

  async findOne(findParams) {
    const param = buildFindParamsObject(findParams);
    return this.model.findOne(param).exec();
  }

  async findOneWithPass(id: string) {
    return this.model
      .findOne({ _id: new ObjectId(id) })
      .select('+password')
      .exec();
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
  async findWithCursor(conditions, options?: QueryOptions): Promise<any> {
    return this.model.find(conditions).sort(options.sort).cursor({ batchSize: options?.batchSize });
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: new ObjectId(id) }).exec();
  }
}
