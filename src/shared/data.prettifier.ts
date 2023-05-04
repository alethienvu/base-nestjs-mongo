import { Model } from 'mongoose';

const convertObject = (dbObj: any, exclude?: Array<string>): object => {
  const apiObj = {};

  if (dbObj instanceof Model) {
    dbObj = dbObj.toObject();
  }

  for (let name of Object.keys(dbObj)) {
    let value = dbObj[name];

    if (name === '_id') {
      name = 'id';
      value = value.toString();
    }

    if (name.indexOf('_') === 0) {
      continue;
    }

    if (exclude && exclude.indexOf(name) >= 0) {
      continue;
    }

    apiObj[name] = value;
  }

  return apiObj;
};

export function mapToObject(map: Map<any, any>) {
  const obj = {};
  map.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

/*
 * Transforms db data to api format
 *
 * This takes care of:
 *  - hiding params started from `_`, which are usually db specific
 *  - transforms _id to id
 *  - excludes fields that is passed to corresponding parameter
 *
 *  @param db array of db objects or db object
 *  @param exclude? list of field names to exclude from the object
 *
 *  @return array of object or object ready to be sent to the API
 */
export function db2api<T1, T2>(db: T1, exclude?: string[]): T2 {
  let response = null;

  if (Array.isArray(db)) {
    response = [];
    for (const obj of db) {
      response.push(convertObject(obj, exclude));
    }
  } else {
    response = convertObject(db, exclude);
  }

  return response;
}

function prepareResponseSingle(obj: any, fields: string[]): any {
  const preparedObj = {};

  if (obj instanceof Model) {
    obj = obj.toObject();
  }

  for (const name of Object.keys(fields)) {
    preparedObj[name] = obj[name];
  }

  return preparedObj;
}

export function prepareResponse<T>(obj: T, fields: string[]): T {
  let response = null;

  if (Array.isArray(obj)) {
    response = [];
    for (const o of obj) {
      response.push(prepareResponseSingle(o, fields));
    }
  } else {
    response = convertObject(obj, fields);
  }

  return response;
}
