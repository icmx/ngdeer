import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { DynamicSelector } from '../../../common/types/dyanmic-selector.type';
import { WithLater } from '../../../common/types/with-later-type';
import { CommentsLoading } from '../enums/comments-loading.enum';
import { Comment } from '../models/comment.model';
import { CommentsApiService } from '../services/comments-api.service';
import { extractCommentsFromReply } from '../operators/extract-comments-from-reply.operator';

export type CommentsStateModel = {
  loading: string;
  entries: Comment[];
};

export class LoadPostComments {
  static readonly type = '[Comments] LoadPostComments';

  constructor(
    public postId: string,
    public params: WithLater = {},
  ) {}
}

export class LoadBranchComments {
  static readonly type = '[Comments] LoadBranchComments';

  constructor(public rootId: string) {}
}

@State<CommentsStateModel>({
  name: 'comments',
  defaults: {
    loading: CommentsLoading.None,
    entries: [],
  },
})
@Injectable()
export class CommentsState {
  constructor(private _commentsApiService: CommentsApiService) {}

  @Action(LoadPostComments)
  loadPostComments(
    ctx: StateContext<CommentsStateModel>,
    { postId, params }: LoadPostComments,
  ): Observable<Comment[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: CommentsLoading.Root });
      }),
      exhaustMap(() => {
        return this._commentsApiService.getPostComments(postId, { params });
      }),
      extractCommentsFromReply(),
      tap((nextEntries) => {
        const { entries: prevEntries } = ctx.getState();
        const entries = [...prevEntries, ...nextEntries];

        ctx.patchState({ loading: CommentsLoading.None, entries });
      }),
    );
  }

  @Action(LoadBranchComments)
  loadBranchComments(
    ctx: StateContext<CommentsStateModel>,
    { rootId }: LoadBranchComments,
  ): Observable<Comment[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: rootId });
      }),
      exhaustMap(() => {
        return this._commentsApiService.getCommentBranch(rootId);
      }),
      extractCommentsFromReply(),
      tap((nextEntries) => {
        const { entries: prevEntries } = ctx.getState();
        const entries = [
          ...prevEntries.filter((entry) => entry.rootId !== rootId),
          ...nextEntries,
        ];

        ctx.patchState({ loading: CommentsLoading.None, entries });
      }),
    );
  }
}

export class CommentsSelectors {
  static loading(
    loading: string,
  ): DynamicSelector<CommentsStateModel, boolean> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      return state.loading === loading;
    });
  }

  static postComments(
    postId: string,
  ): DynamicSelector<CommentsStateModel, Comment[]> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      return state.entries.filter(
        (entry) => entry.rootId === null && entry.postId === postId,
      );
    });
  }

  static postCommentsParams(
    postId: string,
  ): DynamicSelector<CommentsStateModel, WithLater> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      const entries = state.entries.filter(
        (entry) => entry.rootId === null && entry.postId === postId,
      );

      const last = entries.at(-1);

      if (last) {
        return { later: last.id };
      }

      return {};
    });
  }

  static canLoadPostComments(
    postId: string,
  ): DynamicSelector<CommentsStateModel, boolean> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      return state.entries.every((entry) => entry.postId !== postId);
    });
  }

  static canLoadMorePostComments(
    postId: string,
  ): DynamicSelector<CommentsStateModel, boolean> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      const { loading, entries } = state;

      if (loading !== CommentsLoading.None) {
        return false;
      }

      const { length } = entries.filter(
        (entry) => entry.rootId === null && entry.postId === postId,
      );

      const PAGE_SIZE = 20;

      return length % PAGE_SIZE === 0;
    });
  }

  static branchComments(
    rootId: string,
  ): DynamicSelector<CommentsStateModel, Comment[]> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      return state.entries.filter((entry) => entry.rootId === rootId);
    });
  }

  static canLoadMoreBranchComments(
    rootId: string,
  ): DynamicSelector<CommentsStateModel, boolean> {
    return createSelector([CommentsState], (state: CommentsStateModel) => {
      const { loading, entries } = state;

      if (loading === rootId) {
        return false;
      }

      const root = entries.find((entry) => entry.id === rootId);

      if (!root) {
        return false;
      }

      const { length } = entries.filter((entry) => entry.rootId === rootId);

      if (length === 0) {
        return false;
      }

      const { branchSize } = root;

      if (branchSize !== null && branchSize > 0 && branchSize !== length) {
        return true;
      }

      const PAGE_SIZE = 30;

      return length % PAGE_SIZE === 0;
    });
  }
}
