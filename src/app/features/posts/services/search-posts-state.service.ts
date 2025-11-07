import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { WithCategoryId } from '../../../common/types/with-category-id.type';
import { WithText } from '../../../common/types/with-text.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { POST_ENTRIES_CACHE_SERVICE } from '../providers/post-entries-cache-service.provider';
import {
  GetPostsRequestOptions,
  PostsApiService,
} from '../services/posts-api.service';

@Injectable()
export class SearchPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postEntriesCacheService = inject(POST_ENTRIES_CACHE_SERVICE);

  private _isLoading = signal(false);

  private _isDone = signal(false);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  private _load(params: WithText & WithCategoryId): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
        }),
        concatMap(() => {
          const options: GetPostsRequestOptions = {
            params: {},
          };

          const from = this._entries().at(-1)?.id;

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
          this._postEntriesCacheService.add(...entries);

          this._isLoading.set(false);
          this._isDone.set(entries.length === 0);
          this._entries.update((prevEntries) => [...prevEntries, ...entries]);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  load(params: WithText & WithCategoryId): void {
    this._load(params);
  }

  loadMore(params: WithText & WithCategoryId): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    return this._load(params);
  }

  drop(): void {
    this._isLoading.set(false);
    this._isDone.set(false);
    this._entries.set([]);
  }
}
