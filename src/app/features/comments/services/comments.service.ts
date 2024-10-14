import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  CommentsSelectors,
  LoadBranchComments,
  LoadPostComments,
} from '../states/comments.state';
import { Comment } from '../models/comment.model';
import { CommentsLoading } from '../enums/comments-loading.enum';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private _store: Store) {}

  connectLoading(loading: string = CommentsLoading.Root): Observable<boolean> {
    return this._store.select(CommentsSelectors.loading(loading));
  }

  connectPostComments(postId: string): Observable<Comment[]> {
    return this._store.select(CommentsSelectors.postComments(postId));
  }

  startLoadingPostComments(postId: string): void {
    const canLoadPostComments = this._store.selectSnapshot(
      CommentsSelectors.canLoadPostComments(postId),
    );

    if (canLoadPostComments) {
      this._store.dispatch(new LoadPostComments(postId));
    }
  }

  startLoadingMorePostComments(postId: string): void {
    const canLoadMorePostComments = this._store.selectSnapshot(
      CommentsSelectors.canLoadMorePostComments(postId),
    );

    if (canLoadMorePostComments) {
      const postCommentsParams = this._store.selectSnapshot(
        CommentsSelectors.postCommentsParams(postId),
      );

      this._store.dispatch(new LoadPostComments(postId, postCommentsParams));
    }
  }

  connectBranchComments(rootId: string): Observable<Comment[]> {
    return this._store.select(CommentsSelectors.branchComments(rootId));
  }

  connectCanLoadMoreBranchComments(rootId: string): Observable<boolean> {
    return this._store.select(
      CommentsSelectors.canLoadMoreBranchComments(rootId),
    );
  }

  startLoadingBranchComments(rootId: string): void {
    this._store.dispatch(new LoadBranchComments(rootId));
  }
}
