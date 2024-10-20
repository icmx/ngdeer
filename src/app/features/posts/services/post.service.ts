import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { filter, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { LoadPost, PostSelectors } from '../states/post.state';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _store: Store) {}

  selectLoading(): Observable<boolean> {
    return this._store.select(PostSelectors.loading);
  }

  selectEntry(): Observable<Post> {
    return this._store
      .select(PostSelectors.entry)
      .pipe(filter((entry): entry is Post => !!entry));
  }

  startLoading(postId: string): void {
    this._store.dispatch(new LoadPost(postId));
  }
}
