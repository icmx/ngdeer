import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Post } from '../models/post.model';
import {
  CategoryPostsSelectors,
  LoadCategoryPosts,
} from '../states/category-posts.state';

@Injectable({
  providedIn: 'root',
})
export class CategoryPostsService {
  constructor(private _store: Store) {}

  selectLoading(): Observable<boolean> {
    return this._store.select(CategoryPostsSelectors.loading);
  }

  selectEntries(categoryId: string): Observable<Post[]> {
    return this._store.select(CategoryPostsSelectors.entries(categoryId));
  }

  startLoading(categoryId: string): void {
    const canLoad = this._store.selectSnapshot(
      CategoryPostsSelectors.canLoad(categoryId),
    );

    if (canLoad) {
      this._store.dispatch(new LoadCategoryPosts(categoryId));
    }
  }

  startLoadingMore(categoryId: string): void {
    const canLoadMore = this._store.selectSnapshot(
      CategoryPostsSelectors.canLoadMore(categoryId),
    );

    if (canLoadMore) {
      const params = this._store.selectSnapshot(
        CategoryPostsSelectors.params(categoryId),
      );

      this._store.dispatch(new LoadCategoryPosts(categoryId, params));
    }
  }
}
