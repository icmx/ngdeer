import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { WINDOW } from '../providers/window.provider';

@Injectable({
  providedIn: 'root',
})
export class WindowScrollService {
  private _window = inject(WINDOW);

  scroll$ = fromEvent(this._window, 'scroll').pipe(
    filter((event): event is Event & { target: Document } => {
      if (event.target instanceof Document) {
        return true;
      }

      return false;
    }),
  );

  scrollToBottom$ = this.scroll$.pipe(
    map((event): [boolean, typeof event] => {
      const element = event.target.documentElement;

      const limit = element.scrollHeight - element.clientHeight;
      const thresold = limit * 0.1; // it is 10%

      const isBottom = limit - element.scrollTop < thresold;
      return [isBottom, event];
    }),
    distinctUntilChanged(
      ([prevIsBottom], [nextIsBottom]) => prevIsBottom === nextIsBottom,
    ),
    filter(([isBottom]) => isBottom === true),
    map(([, event]) => event),
  );
}
