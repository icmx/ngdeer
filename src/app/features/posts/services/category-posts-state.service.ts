import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { GetPostsRequestOptions, PostsApiService } from './posts-api.service';
import { PostsCacheService } from './posts-cache.service';

export type CategoryPostsStateModel = {
  loading: boolean;
  done: boolean;
  entries: Post[];
};

@Injectable()
export class CategoryPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<CategoryPostsStateModel>({
    loading: false,
    done: false,
    entries: [],
  });

  state = this._state.asReadonly();

  private _load(categoryId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: true }));
        }),
        concatMap(() => {
          const options: GetPostsRequestOptions = { params: {} };

          if (categoryId) {
            options.params = { ...options.params, category_id: categoryId };
          }

          const from = this._state().entries.at(-1)?.id;

          if (from) {
            options.params = { ...options.params, from: from };
          }

          return this._postsApiService.getPosts(options);
        }),
        extractPostsFromReply(),
        tap((entries) => {
          this._postsCacheService.add(...entries);

          this._state.update((state) => ({
            loading: false,
            done: entries.length === 0,
            entries: [...state.entries, ...entries],
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  load(categoryId: string): void {
    if (this._state().entries.length > 0) {
      return;
    }

    this._load(categoryId);
  }

  loadMore(categoryId: string): void {
    const { loading, done } = this._state();

    if (loading || done) {
      return;
    }

    this._load(categoryId);
  }

  drop(): void {
    this._state.set({ loading: false, done: false, entries: [] });
  }
}
