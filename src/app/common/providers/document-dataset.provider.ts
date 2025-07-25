import { inject, InjectionToken, Provider, DOCUMENT } from '@angular/core';

export const DOCUMENT_DATASET = new InjectionToken<DOMStringMap>(
  'DOCUMENT_DATASET',
);

export const provideDocumentDataset = (): Provider => {
  return {
    provide: DOCUMENT_DATASET,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const target = document?.documentElement?.dataset || {};

      return target;
    },
  };
};
