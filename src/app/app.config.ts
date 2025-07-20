import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideBaseTitle } from './common/providers/base-title.provider';
import { provideBaseUrl } from './common/providers/base-url.provider';
import { provideClipboard } from './common/providers/clipboard.provider';
import { provideDocumentDataset } from './common/providers/document-dataset.provider';
import { provideWindow } from './common/providers/window.provider';
import { SettingsState } from './common/states/settings.state';
import { CategoriesStateService } from './features/categories/services/categories-state.service';
import { CommentsState } from './features/comments/states/comments.state';
import { SearchPostsStateService } from './features/posts/services/search-posts-state.service';
import { CategoryPostsStateService } from './features/posts/services/category-posts-state.service';
import { LatestPostsState } from './features/posts/states/latest-posts.state';
import { RandomPostsStateService } from './features/posts/services/random-posts-state.service';
import { PostState } from './features/posts/states/post.state';
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
    provideStore(
      [SettingsState, CommentsState, LatestPostsState, PostState],
      withNgxsStoragePlugin({ keys: [SettingsState], namespace: 'ngdeer' }),
    ),
    provideBaseTitle(),
    provideBaseUrl('https://podslyshano.com/api/v3.5'),
    provideClipboard(),
    provideDocumentDataset(),
    provideWindow(),

    CategoriesStateService,
    RandomPostsStateService,
    CategoryPostsStateService,
    SearchPostsStateService,
  ],
};

export type Link = {
  routerLink: string;
  innerText: string;
};

export const APP_LINKS: Link[] = [
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

export const DEPLOY_URL = 'https://ngdeer.netlify.app';
