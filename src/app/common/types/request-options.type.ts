import { Param } from './param.type';

export type RequestOptions<
  T extends {
    params?: { [key: string]: Param | Param[] };
  },
> = {
  params?: T['params'];
};
