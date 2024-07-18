import { Routes } from '@angular/router';
import { LatestPostsPageComponent } from './features/posts/pages/latest-posts-page/latest-posts-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LatestPostsPageComponent,
    title: 'Новые',
  },
];
