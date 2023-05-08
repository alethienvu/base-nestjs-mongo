import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { debugLog, errorLog } from '../../src/shared/Logger';

export class MongoInMemoryConfigService implements MongooseOptionsFactory {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    return {
      uri,
      connectionFactory: (connection: Connection) => {
        connection.on('error', (error: any) => {
          errorLog(`MongoInMemory connection error: ${error.reason}`);
          throw error;
        });

        connection.on('connected', () => {
          debugLog(`Connection URI @ ${uri}`);
        });

        connection.on('disconnected', async () => {
          await mongod.stop();
        });

        process.on('exit', async () => {
          await connection.close();
          await mongod.stop();
        });

        return connection;
      },
    };
  }
}
