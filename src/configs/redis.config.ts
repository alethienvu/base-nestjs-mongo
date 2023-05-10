import { getConfig } from './index';

export const redisConfig = {
  host: getConfig().get<string>('redis.standalone.host'),
  port: getConfig().get<number>('redis.standalone.port'),
  pass: getConfig().get<string>('redis.standalone.pass') || '',
  url: getConfig().get<string>('redis.standalone.url'),
};
