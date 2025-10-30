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
  done: boolean;
  entries: Post[];
};

@Injectable()
export class LatestPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _isLoading = signal<boolean>(false);

  private _isDone = signal<boolean>(false);

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
          this._postsCacheService.add(...entries);

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
