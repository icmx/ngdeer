import { Scroll } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

export const extractScrollPosition = () => {
  return (source$: Observable<unknown>) => {
    return source$.pipe(
      filter((event): event is Scroll => event instanceof Scroll),
      map((event) => event.position),
    );
  };
};
