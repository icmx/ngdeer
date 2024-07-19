import { Routes } from '@angular/router';
import { LatestPostsPageComponent } from './features/posts/pages/latest-posts-page/latest-posts-page.component';
import { CommentsPageComponent } from './features/comments/pages/comments-page/comments-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LatestPostsPageComponent,
    title: 'Новые',
  },
  {
    path: 'posts/:postId/comments',
    component: CommentsPageComponent,
    title: 'Комментарии'
  }
];
