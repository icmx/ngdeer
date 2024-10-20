import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import {
  LatestPostsSelectors,
  LoadLatestPosts,
} from '../states/latest-posts.state';

@Injectable({
  providedIn: 'root',
})
export class LatestPostsService {
  constructor(private _store: Store) {}

  selectLoading(): Observable<boolean> {
    return this._store.select(LatestPostsSelectors.loading);
  }

  selectEntries(): Observable<Post[]> {
    return this._store.select(LatestPostsSelectors.entries);
  }

  startLoading(): void {
    const canLoad = this._store.selectSnapshot(LatestPostsSelectors.canLoad);

    if (canLoad) {
      this._store.dispatch(new LoadLatestPosts());
    }
  }

  startLoadingMore(): void {
    const canLoadMore = this._store.selectSnapshot(
      LatestPostsSelectors.canLoadMore,
    );

    if (canLoadMore) {
      const params = this._store.selectSnapshot(LatestPostsSelectors.params);

      this._store.dispatch(new LoadLatestPosts(params));
    }
  }
}
