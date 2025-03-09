import { Inject, Injectable } from '@angular/core';
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { WINDOW } from '../providers/window.provider';

@Injectable({
  providedIn: 'root',
})
export class WindowScrollService {
  constructor(
    @Inject(WINDOW)
    private _window: Window,
  ) {}

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
      const thresold = limit * 0.005; // it is 0.5%

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
