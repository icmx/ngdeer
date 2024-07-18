import { Param } from './param.type';

type RequestOptionsGeneric = {
  params?: {
    [name: string]: Param | Param[];
  };
};

export type RequestOptions<T extends RequestOptionsGeneric> = {
  params?: T['params'];
};
