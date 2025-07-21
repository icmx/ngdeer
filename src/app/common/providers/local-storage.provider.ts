import { DOCUMENT, inject, InjectionToken, Provider } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE');

export const provideLocalStorage = (): Provider => {
  return {
    provide: LOCAL_STORAGE,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const target = document.defaultView?.localStorage;

      return target;
    },
  };
};
