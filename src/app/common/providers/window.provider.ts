import { inject, InjectionToken, Provider, DOCUMENT } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WINDOW');

export const provideWindow = (): Provider => {
  return {
    provide: WINDOW,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const target = document.defaultView;

      return target;
    },
  };
};
