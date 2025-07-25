import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { CommentsLoading } from '../enums/comments-loading.enum';
import { Comment } from '../models/comment.model';
import { extractCommentsFromReply } from '../operators/extract-comments-from-reply.operator';
import {
  CommentsApiService,
  GetPostCommentsOptions,
} from './comments-api.service';

export type CommentsStateModel = {
  loading: Record<string, boolean>;
  done: Record<string, boolean>;
  entries: Comment[];
};

@Injectable()
export class CommentsStateService {
  private _destroyRef = inject(DestroyRef);

  private _commentsApiService = inject(CommentsApiService);

  private _state = signal<CommentsStateModel>({
    loading: {},
    done: {},
    entries: [],
  });

  state = this._state.asReadonly();

  private _loadPostCommentsByPostId(postId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, [CommentsLoading.Root]: true },
          }));
        }),
        concatMap(() => {
          const options: GetPostCommentsOptions = {
            params: {},
          };

          const later = this._state()
            .entries.filter(
              (entry) => entry.rootId === null && entry.postId === postId,
            )
            .at(-1)?.id;

          if (later) {
            options.params = { ...options.params, later };
          }

          return this._commentsApiService.getPostComments(postId, options);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          const { loading, done, entries: prevEntries } = this._state();

          const nextEntries = [...prevEntries, ...entries];

          const nextLoading: CommentsStateModel['loading'] = {
            ...loading,
            [CommentsLoading.Root]: false,
          };

          const nextDone: CommentsStateModel['done'] = {
            ...done,
            [CommentsLoading.Root]: entries.length === 0,
          };

          nextEntries.forEach((entry) => {
            if (
              entry.rootId === null &&
              (entry.branchSize === null || entry.branchSize < 3)
            ) {
              nextDone[entry.id] = true;
            }
          });

          this._state.update((state) => ({
            ...state,
            loading: nextLoading,
            done: nextDone,
            entries: nextEntries,
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
          this._state.update((state) => ({
            ...state,
            loading: { ...state.loading, [rootCommentId]: true },
          }));
        }),
        concatMap(() => {
          return this._commentsApiService.getCommentBranch(rootCommentId);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          const { loading, done, entries: prevEntries } = this._state();

          const nextEntries = [...prevEntries, ...entries.slice(2)];

          const nextLoading: CommentsStateModel['loading'] = {
            ...loading,
            [rootCommentId]: false,
          };

          const nextDone: CommentsStateModel['done'] = {
            ...done,
            [rootCommentId]: entries.length < 30,
          };

          this._state.update((state) => ({
            ...state,
            loading: nextLoading,
            done: nextDone,
            entries: nextEntries,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  loadPostCommentsByPostId(postId: string): void {
    if (
      this._state().entries.filter((entry) => entry.postId === postId).length >
      0
    ) {
      return;
    }

    this._loadPostCommentsByPostId(postId);
  }

  loadMorePostCommentsByPostId(postId: string): void {
    const { loading, done } = this._state();

    if (loading[CommentsLoading.Root] || done[CommentsLoading.Root]) {
      return;
    }

    this._loadPostCommentsByPostId(postId);
  }

  loadCommentsBranchByRootCommentId(rootCommentId: string): void {
    if (this._state().loading[rootCommentId]) {
      return;
    }

    this._loadCommentsBranchByRootCommentId(rootCommentId);
  }
}
