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
import { CommentsState } from './features/comments/states/comments.state';
import { CategoryPostsState } from './features/posts/states/category-posts.state';
import { LatestPostsState } from './features/posts/states/latest-posts.state';
import { RandomPostsState } from './features/posts/states/random-posts.state';
import { SearchPostsState } from './features/posts/states/search-posts.state';
import { routes } from './app.routes';

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
    provideStore([
      CategoriesState,
      CommentsState,
      LatestPostsState,
      RandomPostsState,
      CategoryPostsState,
      SearchPostsState,
    ]),
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
