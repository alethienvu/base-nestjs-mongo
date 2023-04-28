// Return Date object that denotes the moment of runtime
// Wrap it in the method for easier to mock for unit test
import * as momentTz from 'moment-timezone';
export function getNow(): Date {
  return new Date(Date.now());
}

export function formatDate(date, tzString) {
  return momentTz
    .tz(new Date(typeof date === 'string' ? new Date(date) : date), tzString)
    .format('DD/MM/YYYY hh:mm');
}

export function formatDateReport(date, tzString) {
  return momentTz
    .tz(new Date(typeof date === 'string' ? new Date(date) : date), tzString)
    .format('Do MMMM YYYY');
}

export function formatDateReportName(date, tzString) {
  return momentTz
    .tz(new Date(typeof date === 'string' ? new Date(date) : date), tzString)
    .format('MMMM yyyy');
}
