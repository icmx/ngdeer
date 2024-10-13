import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  DropSearchPosts,
  LoadSearchPosts,
  SearchPostsSelectors,
} from '../states/search-posts.state';
import { Post } from '../models/post.model';
import { WithText } from '../../../common/types/with-text.type';
import { WithCategoryId } from '../../../common/types/with-category-id.type';

@Injectable({
  providedIn: 'root',
})
export class SearchPostsService {
  constructor(private _store: Store) {}

  connectLoading(): Observable<boolean> {
    return this._store.select(SearchPostsSelectors.loading);
  }

  connectEntries(): Observable<Post[]> {
    return this._store.select(SearchPostsSelectors.entries);
  }

  startLoading(value: WithText & WithCategoryId): void {
    this._store.dispatch([new DropSearchPosts(), new LoadSearchPosts(value)]);
  }

  drop(): void {
    this._store.dispatch(new DropSearchPosts());
  }

  startLoadingMore(value: WithText & WithCategoryId): void {
    const canLoadMore = this._store.selectSnapshot(
      SearchPostsSelectors.canLoadMore,
    );

    if (canLoadMore) {
      const params = this._store.selectSnapshot(SearchPostsSelectors.params);

      this._store.dispatch(new LoadSearchPosts({ ...params, ...value }));
    }
  }
}
