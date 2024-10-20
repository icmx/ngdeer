import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import {
  LoadRandomPosts,
  RandomPostsSelectors,
} from '../states/random-posts.state';

@Injectable({
  providedIn: 'root',
})
export class RandomPostsService {
  constructor(private _store: Store) {}

  selectLoading(): Observable<boolean> {
    return this._store.select(RandomPostsSelectors.loading);
  }

  selectEntries(): Observable<Post[]> {
    return this._store.select(RandomPostsSelectors.entries);
  }

  startLoading(): void {
    const canLoad = this._store.selectSnapshot(RandomPostsSelectors.canLoad);

    if (canLoad) {
      this._store.dispatch(new LoadRandomPosts());
    }
  }

  startLoadMore(): void {
    const canLoadMore = this._store.selectSnapshot(
      RandomPostsSelectors.canLoadMore,
    );

    if (canLoadMore) {
      this._store.dispatch(new LoadRandomPosts());
    }
  }
}
