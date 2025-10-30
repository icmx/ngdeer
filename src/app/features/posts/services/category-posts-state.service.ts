import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { GetPostsRequestOptions, PostsApiService } from './posts-api.service';
import { PostsCacheService } from './posts-cache.service';

@Injectable()
export class CategoryPostsStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _isLoading = signal<boolean>(false);

  private _isDone = signal<boolean>(false);

  private _entries = signal<Post[]>([]);

  isLoading = this._isLoading.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  private _load(categoryId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
        }),
        concatMap(() => {
          const options: GetPostsRequestOptions = { params: {} };

          if (categoryId) {
            options.params = { ...options.params, category_id: categoryId };
          }

          const from = this._entries().at(-1)?.id;

          if (from) {
            options.params = { ...options.params, from: from };
          }

          return this._postsApiService.getPosts(options);
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

  load(categoryId: string): void {
    if (this._entries().length > 0) {
      return;
    }

    this._load(categoryId);
  }

  loadMore(categoryId: string): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    this._load(categoryId);
  }

  drop(): void {
    this._isLoading.set(false);
    this._isDone.set(false);
    this._entries.set([]);
  }
}
