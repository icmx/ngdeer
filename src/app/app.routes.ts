import { Routes } from '@angular/router';
import { AboutPageComponent } from './common/pages/about-page/about-page.component';
import { NotFoundPageComponent } from './common/pages/not-found-page/not-found-page.component';
import { SettingsPageComponent } from './common/pages/settings-page/settings-page.component';
import { CategoriesPageComponent } from './features/categories/pages/categories-page/categories-page.component';
import { CommentsPageComponent } from './features/comments/pages/comments-page/comments-page.component';
import { CategoryPostsPageComponent } from './features/posts/pages/category-posts-page/category-posts-page.component';
import { LatestPostsPageComponent } from './features/posts/pages/latest-posts-page/latest-posts-page.component';
import { RandomPostsPageComponent } from './features/posts/pages/random-posts-page/random-posts-page.component';
import { SearchPostsPageComponent } from './features/posts/pages/search-posts-page/search-posts-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LatestPostsPageComponent,
    title: 'Новые',
  },
  {
    path: 'random',
    component: RandomPostsPageComponent,
    title: 'Случайные',
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
    title: 'Категории',
  },
  {
    path: 'categories/:categoryId/posts',
    component: CategoryPostsPageComponent,
    title: 'Новые',
  },
  {
    path: 'search',
    component: SearchPostsPageComponent,
    title: 'Поиск',
  },
  {
    path: 'posts/:postId/comments',
    component: CommentsPageComponent,
    title: 'Комментарии',
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    title: 'Настройки',
  },
  {
    path: 'about',
    component: AboutPageComponent,
    title: 'О проекте',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Не найдено!',
  },
];
