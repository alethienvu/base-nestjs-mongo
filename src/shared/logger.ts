import * as config from 'config';
import pino from 'pino';

export const logEnabled = Boolean(config.get('logger.enabled'));

export interface IPinoConfig {
  enabled: boolean;
}

const pinoConfig: IPinoConfig = config.get<IPinoConfig>('logger');

export const logger = pino(pinoConfig);

enum LogLevel {
  Error,
  Warning,
  Info,
  Debug,
}

function log(logLevel: LogLevel, data?: any, msg?: any): void {
  if (!logEnabled) {
    return;
  }
  switch (logLevel) {
    case LogLevel.Error:
      return logger.error(data, msg);
    case LogLevel.Debug:
      return logger.debug(data, msg);
    case LogLevel.Warning:
      return logger.warn(data, msg);
    case LogLevel.Info:
    default:
      return logger.info(data, msg);
  }
}

export function errorLog(data?: any, msg?: any): void {
  if (!logEnabled) {
    return;
  }
  log(LogLevel.Error, data, msg);
}

export function debugLog(data?: any, msg?: any): void {
  log(LogLevel.Debug, data, msg);
}

export function infoLog(data?: any, msg?: any): void {
  log(LogLevel.Info, data, msg);
}

export function warnLog(data?: any, msg?: any): void {
  log(LogLevel.Warning, data, msg);
}

export function apiLog(req?: any, res?: any) {
  const data: any = {};
  if (req) {
    data.request = { ...req };
  }

  if (res) {
    data.response = { ...res };
    delete data.response.obj;
    delete data.response.data;
    delete data.response.text;
  }

  debugLog(data);
}

/**
 *
 * @param req http request
 * @returns LOG object
 */
export function getHttpRequestLog(req) {
  if (!req) {
    return null;
  }

  return {
    timestamp: new Date().toISOString(),
    id: req.id,
    // clientIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    method: req.method,
    // originalUri: req.originalUrl,
    uri: req.url,
    referer: req.headers.referer || '',
    // userAgent: req.headers['user-agent'],
    // message: `HTTP Request - ${req.id}`,
    body: req.body,
    headers: req.headers,
  };
}
