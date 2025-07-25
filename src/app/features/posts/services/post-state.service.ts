import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostFromReply } from '../operators/extract-post-from-reply.operator';
import { PostsApiService } from './posts-api.service';
import { PostsCacheService } from './posts-cache.service';

export type PostStateModel = {
  loading: boolean;
  entry: Post | undefined;
};

@Injectable()
export class PostStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<PostStateModel>({
    loading: false,
    entry: undefined,
  });

  state = this._state.asReadonly();

  load(postId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update(() => ({ loading: true, entry: undefined }));
        }),
        concatMap(() => {
          const cachedEntry = this._postsCacheService.get(postId);

          if (cachedEntry) {
            return of(cachedEntry);
          }

          return this._postsApiService
            .getPost(postId)
            .pipe(extractPostFromReply());
        }),
        tap((entry) => {
          this._state.update(() => ({ loading: false, entry }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
