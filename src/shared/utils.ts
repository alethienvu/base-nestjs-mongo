/* istanbul ignore file */
export const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';

export const format2DecimalPoint = (num: number, decimalPoint: number) =>
  Math.round((num + Number.EPSILON) * 10 ** decimalPoint) / 10 ** decimalPoint;

export const convertStartDate2MalayTime = (currentTime?: Date) =>
  new Date(moment(currentTime).tz(DEFAULT_TIMEZONE).startOf('day').format());

export const stringToBoolean = (string) => {
  if (!string) {
    return false;
  }
  switch (string.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(string);
  }
};

export function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
  return _.difference(_.keys(e), _.map(_.filter(_.values(e), _.isNumber), _.toString));
}

export function getEnumValues<T extends string | number>(e: Record<string, T>): T[] {
  return _.values(_.pick(e, getEnumKeys(e)));
}
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
  let password = '';

  while (password.length < 8 || password.length > 20 || !password.match(passwordRegex)) {
    password = '';
    for (let i = 0; i < Math.floor(Math.random() * 13) + 8; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  return password;
};
