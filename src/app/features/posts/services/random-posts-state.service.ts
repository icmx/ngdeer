import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { toUnique } from '../../../common/utils/to-unique.util';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { POST_ENTRIES_CACHE_SERVICE } from '../providers/post-entries-cache-service.provider';
import { PostsApiService } from './posts-api.service';

@Injectable()
export class RandomPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postEntriesCacheService = inject(POST_ENTRIES_CACHE_SERVICE);

  private _load$ = new Subject<void>();

  private _isLoading = signal(false);

  private _error = signal<string | null>(null);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  error = this._error.asReadonly();

  entries = this._entries.asReadonly();

  constructor() {
    this._setupLoad();
  }

  load(): void {
    if (this._entries().length > 0) {
      return;
    }

    this._load$.next();
  }

  loadMore(): void {
    if (this._isLoading()) {
      return;
    }

    this._load$.next();
  }

  reset(): void {
    this._isLoading.set(false);
    this._error.set(null);
    this._entries.set([]);
  }

  private _getEntries(): Observable<Post[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this._postsApiService.getPostsRandom({}).pipe(
      extractPostsFromReply(),
      tap((entries) => {
        this._postEntriesCacheService.set(...entries);

        this._entries.update((prevEntries) =>
          [...prevEntries, ...entries].filter(toUnique((entry) => entry.id)),
        );
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
        exhaustMap(() => {
          return this._getEntries();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
