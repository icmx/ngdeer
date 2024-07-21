import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideHttpClient(),
  ],
};

export type Link = {
  routerLink: string;
  innerText: string;
};

export const appLinks: Link[] = [
  {
    routerLink: '/',
    innerText: 'Новые',
  },
  {
    routerLink: '/random',
    innerText: 'Случайные',
  },
  {
    routerLink: '/categories',
    innerText: 'Категории',
  },
  {
    routerLink: '/search',
    innerText: 'Поиск',
  },
];
