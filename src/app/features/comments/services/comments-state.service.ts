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
  loading: string;
  entries: Comment[];
};

@Injectable()
export class CommentsStateService {
  private _destroyRef = inject(DestroyRef);

  private _commentsApiService = inject(CommentsApiService);

  private _state = signal<CommentsStateModel>({
    loading: CommentsLoading.None,
    entries: [],
  });

  state = this._state.asReadonly();

  load(postId: string): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({
            ...state,
            loading: CommentsLoading.Root,
          }));
        }),
        concatMap(() => {
          const options: GetPostCommentsOptions = {
            params: {},
          };

          const later = this._state()
            .entries.filter((entry) => entry.postId === postId)
            .at(-1)?.id;

          if (later) {
            options.params = { ...options.params, later };
          }

          return this._commentsApiService.getPostComments(postId, options);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          this._state.update((state) => ({
            loading: CommentsLoading.None,
            entries: [...state.entries, ...entries],
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  loadBranch(rootCommentId: string): void {
    if (this._state().loading === rootCommentId) {
      return;
    }

    of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: rootCommentId }));
        }),
        concatMap(() => {
          return this._commentsApiService.getCommentBranch(rootCommentId);
        }),
        extractCommentsFromReply(),
        tap((entries) => {
          this._state.update((state) => ({
            loading: CommentsLoading.None,
            entries: [
              ...state.entries.filter(
                (entry) => entry.rootId !== rootCommentId,
              ),
              ...entries,
            ],
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
