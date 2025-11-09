import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideBaseTitle } from './common/providers/base-title.provider';
import { provideBaseUrl } from './common/providers/base-url.provider';
import { provideClipboard } from './common/providers/clipboard.provider';
import { provideDocumentDataset } from './common/providers/document-dataset.provider';
import { provideLocalStorage } from './common/providers/local-storage.provider';
import { provideWindow } from './common/providers/window.provider';
import { DisclaimerService } from './common/services/disclaimer.service';
import { LocalStorageService } from './common/services/local-storage.service';
import { ThemesService } from './common/services/themes.service';
import { CategoriesStateService } from './features/categories/services/categories-state.service';
import { CommentsStateService } from './features/comments/services/comments-state.service';
import { CategoryPostsStateService } from './features/posts/services/category-posts-state.service';
import { LatestPostsStateService } from './features/posts/services/latest-posts-state.service';
import { PostStateService } from './features/posts/services/post-state.service';
import { providePostEntriesCacheService } from './features/posts/providers/post-entries-cache-service.provider';
import { RandomPostsStateService } from './features/posts/services/random-posts-state.service';
import { SearchPostsStateService } from './features/posts/services/search-posts-state.service';
import { provideUserEntriesCacheService } from './features/users/providers/user-entries-cache-service.provider';
import { UserDialogService } from './features/users/components/user-dialog/user-dialog.service';
import { UsersStateService } from './features/users/services/users-state.service';
import { HiddenUsersIdsService } from './features/users/services/hidden-users-ids.service';
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
    provideBaseTitle(),
    provideBaseUrl('https://podslyshano.com/api/v3.5'),
    provideClipboard(),
    provideDocumentDataset(),
    provideWindow(),
    provideLocalStorage(),
    LocalStorageService,
    DisclaimerService,
    ThemesService,
    CategoriesStateService,
    providePostEntriesCacheService(),
    PostStateService,
    CommentsStateService,
    LatestPostsStateService,
    RandomPostsStateService,
    CategoryPostsStateService,
    SearchPostsStateService,
    UserDialogService,
    HiddenUsersIdsService,
    provideUserEntriesCacheService(),
    UsersStateService,
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
