import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideStore } from '@ngxs/store';
import { provideBaseUrl } from './common/providers/base-url.provider';
import { provideBaseTitle } from './common/providers/base-title.provider';
import { provideLocalStorage } from './common/providers/local-storage.provider';
import { CategoriesState } from './features/categories/states/categories.state';
import { routes } from './app.routes';
import { CommentsState } from './features/comments/states/comments.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(),
    provideStore([CategoriesState, CommentsState]),
    provideBaseTitle(),
    provideBaseUrl('https://podslyshano.com/api/v3.5'),
    provideLocalStorage(),
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
  {
    routerLink: '/settings',
    innerText: 'Настройки',
  },
  {
    routerLink: '/about',
    innerText: 'О проекте',
  },
];
