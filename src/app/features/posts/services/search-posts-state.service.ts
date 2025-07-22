import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { WithCategoryId } from '../../../common/types/with-category-id.type';
import { WithText } from '../../../common/types/with-text.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import {
  GetPostsRequestOptions,
  PostsApiService,
} from '../services/posts-api.service';
import { PostsCacheService } from '../services/posts-cache.service';

export type SearchPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

@Injectable()
export class SearchPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<SearchPostsStateModel>({
    loading: false,
    entries: [],
  });

  state = this._state.asReadonly();

  private _load(params: WithText & WithCategoryId): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: true }));
        }),
        concatMap(() => {
          const options: GetPostsRequestOptions = {
            params: {},
          };

          const from = this._state().entries.at(-1)?.id;

          if (from) {
            options.params = { ...options.params, from: from };
          }

          if (params.text) {
            options.params = {
              ...options.params,
              search_criteria: params.text,
            };
          }

          if (params.categoryId) {
            options.params = {
              ...options.params,
              category_id: params.categoryId,
            };
          }

          return this._postsApiService.getPosts(options);
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

  load(params: WithText & WithCategoryId): void {
    this._load(params);
  }

  loadMore(params: WithText & WithCategoryId): void {
    if (this._state().loading) {
      return;
    }

    return this._load(params);
  }

  drop(): void {
    this._state.set({ loading: false, entries: [] });
  }
}
