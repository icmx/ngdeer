import { DateInit } from '../types/date-init.type';

export const toAbsoluteDateString = (init: DateInit): string => {
  return new Date(init).toJSON().replace('T', ' ').slice(0, 16);
};
