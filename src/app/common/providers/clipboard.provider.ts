import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken, Provider } from '@angular/core';

export const CLIPBOARD = new InjectionToken<Clipboard>('CLIPBOARD')

export const provideClipboard = (): Provider => {
  return {
    provide: CLIPBOARD,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const clipboard = document.defaultView?.navigator.clipboard

      return clipboard
    }
  }
}
