import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';

export const extractParam = <T extends undefined | string>(key: string) => {
  return (source$: Observable<Params>): Observable<T> => {
    return source$.pipe(map((source) => source[key]));
  };
};
