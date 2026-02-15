import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
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

  private _load$ = new Subject<GetPostsRequestOptions>();

  private _loadMore$ = new Subject<GetPostsRequestOptions>();

  private _isLoading = signal(false);

  private _error = signal<string | null>(null);

  private _isDone = signal(false);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  error = this._error.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  constructor() {
    this._setupLoad();
    this._setupLoadMore();
  }

  load(params: WithText & WithCategoryId): void {
    if (this._entries().length > 0) {
      return;
    }

    this._load$.next({
      params: toParams({
        search_criteria: params.text,
        category_id: params.categoryId,
      }),
    });
  }

  loadMore(params: WithText & WithCategoryId): void {
    if (this._isDone() || this._isLoading()) {
      return;
    }

    this._loadMore$.next({
      params: toParams({
        from: this._entries().at(-1)?.id || undefined,
        search_criteria: params.text,
        category_id: params.categoryId,
      }),
    });
  }

  reset(): void {
    this._error.set(null);
    this._isDone.set(false);
    this._entries.set([]);
  }

  private _getEntries(options: GetPostsRequestOptions): Observable<Post[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this._postsApiService.getPosts(options).pipe(
      extractPostsFromReply(),
      tap((entries) => {
        this._postEntriesCacheService.set(...entries);

        this._isDone.set(entries.length === 0);
        this._entries.update((prev) => [...prev, ...entries]);
      }),
      catchError((error) => {
        this._error.set(error?.message || 'Failed while fetching posts');

        return EMPTY;
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  private _setupLoad(): void {
    this._load$
      .pipe(
        switchMap((options) => {
          return this._getEntries(options);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _setupLoadMore(): void {
    this._loadMore$
      .pipe(
        exhaustMap((options) => {
          return this._getEntries(options);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
