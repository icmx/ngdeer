import { DateInit } from '../types/date-init.type';

const rtf = new Intl.RelativeTimeFormat('ru', {
  numeric: 'auto',
  style: 'short',
});

const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

const units: Intl.RelativeTimeFormatUnit[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

export const toRelativeDateString = (init: DateInit): string => {
  const delta = Math.round((new Date(init).getTime() - Date.now()) / 1000);
  const index = cutoffs.findIndex((cutoff) => cutoff > Math.abs(delta));
  const divisor = index ? cutoffs[index - 1] : 1;

  return rtf.format(Math.floor(delta / divisor), units[index]);
};
