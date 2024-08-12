import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken, Provider } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE');

export const provideLocalStorage = (): Provider => {
  return {
    provide: LOCAL_STORAGE,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const localStorage = document.defaultView?.localStorage;

      return localStorage;
    },
  };
};
