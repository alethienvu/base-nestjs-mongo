import { HttpStatus } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as BPromise from 'bluebird';
import { Response } from 'express';
import * as jsonWebToken from 'jsonwebtoken';
import { getConfig } from '../modules/config/config.provider';

const jwt = BPromise.promisifyAll(jsonWebToken);

export function createMongooseOptions(uriConfigPath: string): MongooseModuleOptions {
  return {
    uri: getConfig().get(uriConfigPath),
  };
}

export function decodeJWTToken(token: string) {
  return jwt.decode(token);
}

export const APPLICATION_JSON = 'application/json';

export function tryParseJsonString(value: any): any {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}
export const roundNumber = (number: number, decimals: number) =>
  Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);

export function buildFilterDateParam(fromDate?: Date, toDate?: Date) {
  if (fromDate && toDate) {
    return {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  if (fromDate) {
    return {
      $gte: fromDate,
    };
  }

  return null;
}

export function reply<T = any>(
  response: Response,
  body: T,
  status: HttpStatus = HttpStatus.OK,
): Response {
  if (response.headersSent || response.writableEnded) {
    return response;
  }
  return response.status(status).json(body);
}
