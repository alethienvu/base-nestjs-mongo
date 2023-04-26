import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as config from 'config';
export const CONFIG = 'ConfigProviderToken';

export const configProvider: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};

export const isLocal = () => {
  const host = config.get('server.host');
  return host === 'localhost' || host === '127.0.0.1';
};

export const getHost = () => {
  const hostname = config.get('server.hostname');
  if (hostname) {
    return `${hostname}`;
  }
  return `${config.get('server.host')}:${config.get('server.port')}`;
};

export const getPort = (): string => {
  return `${config.get('server.port')}`;
};

export const getConfig = () => {
  return config;
};

export const configProviders = [
  {
    provide: 'configService',
    useFactory: (): config.IConfig => config,
  },
  {
    provide: 'hostName',
    useFactory: getHost,
  },
];
