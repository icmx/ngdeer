import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import { DynamicSelector } from '../../../common/types/dyanmic-selector.type';
import { WithFrom } from '../../../common/types/with-from.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { PostsApiService } from '../services/posts-api.service';

export type CategoryPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

export class LoadCategoryPosts {
  static readonly type = '[CategoryPosts] Load';

  constructor(
    public categoryId: string,
    public params: WithFrom = {},
  ) {}
}

@State<CategoryPostsStateModel>({
  name: 'categoryPosts',
  defaults: {
    loading: false,
    entries: [],
  },
})
@Injectable()
export class CategoryPostsState {
  constructor(private _postsApiService: PostsApiService) {}

  @Action(LoadCategoryPosts)
  loadEntries(
    ctx: StateContext<CategoryPostsStateModel>,
    { categoryId, params }: LoadCategoryPosts,
  ): Observable<Post[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true });
      }),
      exhaustMap(() => {
        return this._postsApiService.getPosts({
          params: { category_id: categoryId, ...params },
        });
      }),
      extractPostsFromReply(),
      tap((nextEntries) => {
        const { entries: prevEntries } = ctx.getState();
        const entries = [...prevEntries, ...nextEntries];

        ctx.patchState({ loading: false, entries });
      }),
    );
  }
}

export class CategoryPostsSelectors {
  @Selector([CategoryPostsState])
  static loading(state: CategoryPostsStateModel): boolean {
    return state.loading;
  }

  static entries(
    categoryId: string,
  ): DynamicSelector<CategoryPostsStateModel, Post[]> {
    return createSelector(
      [CategoryPostsState],
      (state: CategoryPostsStateModel) => {
        return state.entries.filter((entry) => entry.categoryId === categoryId);
      },
    );
  }

  static params(
    categoryId: string,
  ): DynamicSelector<CategoryPostsStateModel, WithFrom> {
    return createSelector(
      [CategoryPostsState],
      (state: CategoryPostsStateModel) => {
        const { entries } = state;

        const last = entries
          .filter((entry) => entry.categoryId === categoryId)
          .at(-1);

        if (last) {
          return { from: last.id };
        }

        return {};
      },
    );
  }

  static canLoad(
    categoryId: string,
  ): DynamicSelector<CategoryPostsStateModel, boolean> {
    return createSelector(
      [CategoryPostsState],
      (state: CategoryPostsStateModel) => {
        return (
          state.entries.filter((entry) => entry.categoryId === categoryId)
            .length === 0
        );
      },
    );
  }

  static canLoadMore(
    categoryId: string,
  ): DynamicSelector<CategoryPostsStateModel, boolean> {
    return createSelector(
      [CategoryPostsState],
      (state: CategoryPostsStateModel) => {
        return (
          !state.loading &&
          state.entries.filter((entry) => entry.categoryId === categoryId)
            .length > 0
        );
      },
    );
  }
}
