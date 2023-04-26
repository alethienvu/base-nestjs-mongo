/* istanbul ignore file */
export const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';
import * as moment from 'moment-timezone';

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
