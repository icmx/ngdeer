import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { WithFrom } from '../../../common/types/with-from.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { PostsApiService } from './posts-api.service';
import { PostsCacheService } from './posts-cache.service';

export type LatestPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

@Injectable()
export class LatestPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<LatestPostsStateModel>({
    loading: false,
    entries: [],
  });

  state = this._state.asReadonly();

  load(): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: true }));
        }),
        concatMap(() => {
          const params: WithFrom = {};

          const from = this._state().entries.at(-1)?.id;

          if (from) {
            params.from = from;
          }

          return this._postsApiService.getPosts({ params });
        }),
        extractPostsFromReply(),
        tap((entries) => {
          this._postsCacheService.add(...entries);

          this._state.update((state) => ({
            loading: false,
            entries: [...state.entries, ...entries],
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  drop(): void {
    this._state.set({ loading: false, entries: [] });
  }
}
