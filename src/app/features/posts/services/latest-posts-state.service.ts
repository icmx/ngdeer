import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { WithFrom } from '../../../common/types/with-from.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { POST_ENTRIES_CACHE_SERVICE } from '../providers/post-entries-cache-service.provider';
import { PostsApiService } from './posts-api.service';

@Injectable()
export class LatestPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postEntriesCacheService = inject(POST_ENTRIES_CACHE_SERVICE);

  private _isLoading = signal(false);

  private _isDone = signal(false);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  private _load(): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
        }),
        concatMap(() => {
          const params: WithFrom = {};

          const from = this.entries().at(-1)?.id;

          if (from) {
            params.from = from;
          }

          return this._postsApiService.getPosts({ params });
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

  load(): void {
    if (this._entries().length > 0) {
      return;
    }

    this._load();
  }

  loadMore(): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    this._load();
  }

  drop(): void {
    this._isLoading.set(false);
    this._isDone.set(false);
    this._entries.set([]);
  }
}
