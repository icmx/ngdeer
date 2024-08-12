import { InjectionToken, Provider } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BASE_URL');

export const provideBaseUrl = (baseUrl: string): Provider => {
  return {
    provide: BASE_URL,
    useValue: baseUrl,
  };
};
