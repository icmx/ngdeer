import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { PostsApiService } from './posts-api.service';
import { PostsCacheService } from './posts-cache.service';
import { SearchPostsStateModel } from './search-posts-state.service';

export type RandomPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

@Injectable()
export class RandomPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<SearchPostsStateModel>({
    loading: false,
    entries: [],
  });

  state = this._state.asReadonly();

  private _load(): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: true }));
        }),
        concatMap(() => {
          return this._postsApiService.getPostsRandom();
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

  load(): void {
    if (this._state().entries.length > 0) {
      return;
    }

    this._load();
  }

  loadMore(): void {
    if (this._state().loading) {
      return;
    }

    this._load();
  }

  drop(): void {
    this._state.set({ loading: false, entries: [] });
  }
}
