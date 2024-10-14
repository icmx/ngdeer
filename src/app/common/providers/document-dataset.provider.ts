import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken, Provider } from '@angular/core';

export const DOCUMENT_DATASET = new InjectionToken<DOMStringMap>(
  'DOCUMENT_DATASET',
);

export const provideDocumentDataset = (): Provider => {
  return {
    provide: DOCUMENT_DATASET,
    useFactory: () => {
      const document = inject(DOCUMENT);
      const dataset = document?.documentElement?.dataset || {};

      return dataset;
    },
  };
};
