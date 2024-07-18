import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';

export const extractParams = <
  T extends { [key: string]: undefined | string },
>() => {
  return (source$: Observable<Params>): Observable<T> => {
    return source$.pipe(map((source) => source as T));
  };
};
