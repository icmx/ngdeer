import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, of, tap } from 'rxjs';
import { WithCategoryId } from '../../../common/types/with-category-id.type';
import { WithText } from '../../../common/types/with-text.type';
import { toParams } from '../../../common/utils/to-params.util';
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

  private _error = signal<string | null>(null);

  private _isDone = signal(false);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  error = this._error.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  private _load(params: GetPostsRequestOptions['params']): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
        }),
        concatMap(() => {
          return this._postsApiService.getPosts({ params });
        }),
        extractPostsFromReply(),
        tap((entries) => {
          this._postEntriesCacheService.set(...entries);

          this._isDone.set(entries.length === 0);
          this._entries.update((prevEntries) => [...prevEntries, ...entries]);
        }),
        catchError((error) => {
          this._error.set(error?.message || 'Failed while fetching posts');

          return EMPTY;
        }),
        finalize(() => {
          this._isLoading.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  load(params: WithText & WithCategoryId): void {
    if (this._entries().length > 0) {
      return;
    }

    this._load(
      toParams({
        search_criteria: params.text,
        category_id: params.categoryId,
      }),
    );
  }

  loadMore(params: WithText & WithCategoryId): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    return this._load(
      toParams({
        from: this._entries().at(-1)?.id || undefined,
        search_criteria: params.text,
        category_id: params.categoryId,
      }),
    );
  }

  drop(): void {
    this._isLoading.set(false);
    this._error.set(null);
    this._isDone.set(false);
    this._entries.set([]);
  }
}
