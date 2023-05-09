import { HttpStatus } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as BPromise from 'bluebird';
import { Response } from 'express';
import * as jsonWebToken from 'jsonwebtoken';
import { Decimal128, ObjectId } from 'bson';
import { getConfig } from '../modules/config/config.provider';
import * as _ from 'lodash';

const jwt = BPromise.promisifyAll(jsonWebToken);

export function createMongooseOptions(uriConfigPath: string): MongooseModuleOptions {
  return {
    uri: getConfig().get(uriConfigPath),
  };
}

export function decodeJWTToken(token: string) {
  return jwt.decode(token);
}

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

export interface ConvertObjectOptions {
  /**
   * Fields to exclude, either as dot-notation string or path array
   */
  exclude?: (string | string[])[];
  /**
   * Exclude properties starting with prefix
   */
  excludePrefix?: string;
  /**
   * Function to replace value (see lodash@cloneDeepWith)
   */
  replacer?: (value: any) => any;
  /**
   * Key-to-key mapping, or function
   */
  keymap?: { [key: string]: string } | ((key: string) => string);
}

export function convertSetToObject<T = any>(value: Set<T>): T[] {
  return Array.from(value.values());
}

export function convertMapToPlainObject<T = any>(value: Map<string, T>): { [key: string]: T } {
  return _.fromPairs(Array.from(value.entries()));
}

export function forOwnRecursive(
  obj: any,
  iteratee: (value: any, path: string[], obj: any) => any = _.identity,
) {
  return _.forOwn(obj, (value, key) => {
    const path = [].concat(key.toString());
    if (_.isPlainObject(value) || _.isArray(value)) {
      return forOwnRecursive(value, (v, p) => iteratee(v, path.concat(p), obj));
    }
    return iteratee(value, path, obj);
  });
}

export function convertObject(obj: any, options: ConvertObjectOptions = {}): any {
  const defaultReplacer = (value) => {
    if (value instanceof ObjectId) {
      return value.toHexString();
    }
    if (value instanceof Decimal128) {
      return Number(value.toString());
    }
    if (value instanceof Set) {
      return convertSetToObject(value);
    }
    if (value instanceof Map) {
      return convertMapToPlainObject(value);
    }
  };
  const {
    exclude = [],
    excludePrefix = '_',
    replacer = defaultReplacer,
    keymap = { _id: 'id' },
  } = options;
  const resultObj = _.cloneDeepWith(obj, replacer);
  if (_.isPlainObject(resultObj) || _.isArray(resultObj)) {
    forOwnRecursive(resultObj, (value, path) => {
      const key = _.last(path);
      const newKey = _.isFunction(keymap) ? (keymap as any)(key) : _.get(keymap, key);
      if (newKey) {
        _.set(resultObj, _.concat(_.dropRight(path), newKey), value);
      }
    });
    forOwnRecursive(resultObj, (value, path) => {
      if (excludePrefix && _.last(path).startsWith(excludePrefix)) {
        _.unset(resultObj, path);
      }
      _.forEach(exclude, (field) => {
        if (_.isString(field)) {
          field = _.toPath(field);
        }
        if (_.isEqual(field, path)) {
          _.unset(resultObj, path);
          return false;
        }
      });
    });
  }
  return resultObj;
}

/**
 *
 * @param objToUpdate Object need to update
 * @param updatedProps Object contain update field
 */
export function updateObject(objToUpdate, updatedProps) {
  for (const prop in updatedProps) {
    objToUpdate[prop] = updatedProps[prop];
  }
}
