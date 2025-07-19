import { inject, InjectionToken, Provider, DOCUMENT } from '@angular/core';

export const CLIPBOARD = new InjectionToken<Clipboard>('CLIPBOARD');

export const provideClipboard = (): Provider => {
  return {
    provide: CLIPBOARD,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const target = document.defaultView?.navigator.clipboard;

      return target;
    },
  };
};
