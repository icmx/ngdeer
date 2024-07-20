import { Routes } from '@angular/router';
import { CommentsPageComponent } from './features/comments/pages/comments-page/comments-page.component';
import { LatestPostsPageComponent } from './features/posts/pages/latest-posts-page/latest-posts-page.component';
import { RandomPostsPageComponent } from './features/posts/pages/random-posts-page/random-posts-page.component';
import { CategoriesPageComponent } from './features/categories/pages/categories-page/categories-page.component';
import { CategoryPostsPageComponent } from './features/posts/pages/category-posts-page/category-posts-page.component';

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
    title: 'Новые'
  },
  {
    path: 'posts/:postId/comments',
    component: CommentsPageComponent,
    title: 'Комментарии',
  },
];
