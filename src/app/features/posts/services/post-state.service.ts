import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostFromReply } from '../operators/extract-post-from-reply.operator';
import { POST_ENTRIES_CACHE_SERVICE } from '../providers/post-entries-cache-service.provider';
import { PostsApiService } from './posts-api.service';

@Injectable()
export class PostStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postEntriesCacheService = inject(POST_ENTRIES_CACHE_SERVICE);

  private _isLoading = signal(false);

  private _entry = signal<Post | null>(null);

  isLoading = this._isLoading.asReadonly();

  entry = this._entry.asReadonly();

  load(postId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
          this._entry.set(null);
        }),
        concatMap(() => {
          const cachedEntry = this._postEntriesCacheService.get(postId);

          if (cachedEntry) {
            return of(cachedEntry);
          }

          return this._postsApiService
            .getPost(postId)
            .pipe(extractPostFromReply());
        }),
        tap((entry) => {
          this._isLoading.set(false);
          this._entry.set(entry);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
