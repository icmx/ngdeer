import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, concatMap, EMPTY, finalize, of, tap } from 'rxjs';
import { CommentsLoading } from '../enums/comments-loading.enum';
import { Comment } from '../models/comment.model';
import { extractCommentsFromReply } from '../operators/extract-comments-from-reply.operator';
import { toUser } from '../../users/mappers/to-user.mapper';
import { USER_ENTRIES_CACHE_SERVICE } from '../../users/providers/user-entries-cache-service.provider';
import {
  CommentsApiService,
  GetPostCommentsOptions,
} from './comments-api.service';

// this amount of comments is already loaded and visible before user
// decides to load a full branch (if any)
export const PREVIOUSLY_VISIBLE_COMMENTS_AMOUNT = 2;

@Injectable()
export class CommentsStateService {
  private _destroyRef = inject(DestroyRef);

  private _commentsApiService = inject(CommentsApiService);

  private _userEntriesCacheService = inject(USER_ENTRIES_CACHE_SERVICE);

  private _isLoadingBy = signal<Record<string, boolean>>({});

  private _error = signal<string | null>(null);

  private _isDoneBy = signal<Record<string, boolean>>({});

  private _entries = signal<Comment[]>([]);

  isLoadingBy = this._isLoadingBy.asReadonly();

  error = this._error.asReadonly();

  isDoneBy = this._isDoneBy.asReadonly();

  entries = this._entries.asReadonly();

  private _loadPostCommentsByPostId(postId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoadingBy.update((isLoadingBy) => ({
            ...isLoadingBy,
            [CommentsLoading.Root]: true,
          }));
        }),
        concatMap(() => {
          const options: GetPostCommentsOptions = {
            params: {},
          };

          const later = this._entries()
            .filter((entry) => entry.rootId === null && entry.postId === postId)
            .at(-1)?.id;

          if (later) {
            options.params = { ...options.params, later };
          }

          return this._commentsApiService.getPostsCommentsByPostId(
            postId,
            options,
          );
        }),
        tap((reply) => {
          const entries = reply.comments
            .map((comment) => comment.user)
            .map(toUser);

          this._userEntriesCacheService.set(...entries);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          const prevEntries = this._entries();
          const nextEntries = [...prevEntries, ...entries];

          this._entries.set(nextEntries);

          this._isDoneBy.update((prevIsDoneBy) => {
            const nextIsDoneBy = { ...prevIsDoneBy };

            nextIsDoneBy[CommentsLoading.Root] = entries.length === 0;

            nextEntries.forEach((entry) => {
              if (
                entry.rootId === null &&
                (entry.branchSize === null || entry.branchSize < 3)
              ) {
                nextIsDoneBy[entry.id] = true;
              }
            });

            return nextIsDoneBy;
          });

          this._isLoadingBy.update((isLoadingBy) => ({
            ...isLoadingBy,
            [CommentsLoading.Root]: false,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _loadCommentsBranchByRootCommentId(rootCommentId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoadingBy.update((isLoadingBy) => ({
            ...isLoadingBy,
            [rootCommentId]: true,
          }));
        }),
        concatMap(() => {
          return this._commentsApiService.getCommentsBranchByRootCommentId(
            rootCommentId,
          );
        }),
        tap((reply) => {
          const entries = reply.comments
            .map((comment) => comment.user)
            .map(toUser);

          this._userEntriesCacheService.set(...entries);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          this._entries.update((prevEntries) => [
            ...prevEntries,
            ...entries.slice(PREVIOUSLY_VISIBLE_COMMENTS_AMOUNT),
          ]);

          this._isDoneBy.update((isDoneBy) => ({
            ...isDoneBy,
            [rootCommentId]: entries.length < 30,
          }));
        }),
        catchError((error) => {
          this._error.set(error?.message || 'Failed while fetching comments');

          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingBy.update((isLoadingBy) => ({
            ...isLoadingBy,
            [rootCommentId]: false,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  loadPostCommentsByPostId(postId: string): void {
    if (this._entries().filter((entry) => entry.postId === postId).length > 0) {
      return;
    }

    this._loadPostCommentsByPostId(postId);
  }

  loadMorePostCommentsByPostId(postId: string): void {
    if (
      this._isLoadingBy()[CommentsLoading.Root] ||
      this._isDoneBy()[CommentsLoading.Root]
    ) {
      return;
    }

    this._loadPostCommentsByPostId(postId);
  }

  loadCommentsBranchByRootCommentId(rootCommentId: string): void {
    if (this.isLoadingBy()[rootCommentId]) {
      return;
    }

    this._loadCommentsBranchByRootCommentId(rootCommentId);
  }
}
