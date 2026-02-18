import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  defer,
  EMPTY,
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Post } from '../models/post.model';
import { extractPostFromReply } from '../operators/extract-post-from-reply.operator';
import { POST_ENTRIES_CACHE_SERVICE } from '../providers/post-entries-cache-service.provider';
import { GetPostByPostIdRequest, PostsApiService } from './posts-api.service';

@Injectable()
export class PostStateService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postEntriesCacheService = inject(POST_ENTRIES_CACHE_SERVICE);

  private _load$ = new Subject<GetPostByPostIdRequest>();

  private _isLoading = signal(false);

  private _error = signal<string | null>(null);

  private _entry = signal<Post | null>(null);

  isLoading = this._isLoading.asReadonly();

  error = this._error.asReadonly();

  entry = this._entry.asReadonly();

  constructor() {
    this._setupLoad();
  }

  load(postId: string): void {
    this._load$.next({ path: { postId } });
  }

  private _getEntry(request: GetPostByPostIdRequest): Observable<Post> {
    return defer(() => {
      this._error.set(null);

      const cached = this._postEntriesCacheService.get(request.path.postId);

      if (cached) {
        return of(cached);
      }

      this._isLoading.set(true);

      return this._postsApiService.getPost(request).pipe(
        extractPostFromReply(),
        tap((entry) => {
          this._postEntriesCacheService.set(entry);
        }),
      );
    }).pipe(
      tap((entry) => {
        this._entry.set(entry);
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
        switchMap((request) => {
          return this._getEntry(request);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
