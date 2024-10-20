import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { WithCategoryId } from '../../../common/types/with-category-id.type';
import { WithFrom } from '../../../common/types/with-from.type';
import { WithText } from '../../../common/types/with-text.type';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import {
  GetPostsRequestOptions,
  PostsApiService,
} from '../services/posts-api.service';

export type SearchPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

export class LoadSearchPosts {
  static readonly type = '[SeachPosts] Load';

  constructor(public params: WithText & WithFrom & WithCategoryId = {}) {}
}

export class DropSearchPosts {
  static readonly type = '[SearchPosts] Drop';
}

@State<SearchPostsStateModel>({
  name: 'searchPosts',
  defaults: {
    loading: false,
    entries: [],
  },
})
@Injectable()
export class SearchPostsState {
  constructor(private _postsApiService: PostsApiService) {}

  @Action(LoadSearchPosts)
  loadEntries(
    ctx: StateContext<SearchPostsStateModel>,
    { params }: LoadSearchPosts,
  ): Observable<Post[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true });
      }),
      exhaustMap(() => {
        const options: GetPostsRequestOptions = {
          params: {},
        };

        if (params.from) {
          options.params = { ...options.params, from: params.from };
        }

        if (params.text) {
          options.params = { ...options.params, search_criteria: params.text };
        }

        if (params.categoryId) {
          options.params = {
            ...options.params,
            category_id: params.categoryId,
          };
        }

        return this._postsApiService.getPosts(options);
      }),
      extractPostsFromReply(),
      tap((nextEntries) => {
        const { entries: prevEntries } = ctx.getState();
        const entries = [...prevEntries, ...nextEntries];

        ctx.patchState({ loading: false, entries });
      }),
    );
  }

  @Action(DropSearchPosts)
  dropSearchPosts(ctx: StateContext<SearchPostsStateModel>): void {
    ctx.patchState({ loading: false, entries: [] });
  }
}

export class SearchPostsSelectors {
  @Selector([SearchPostsState])
  static loading(state: SearchPostsStateModel): boolean {
    return state.loading;
  }

  @Selector([SearchPostsState])
  static entries(state: SearchPostsStateModel): Post[] {
    return state.entries;
  }

  @Selector([SearchPostsState])
  static canLoadMore(state: SearchPostsStateModel): boolean {
    return state.entries.length > 0 && !state.loading;
  }

  @Selector([SearchPostsState])
  static params(state: SearchPostsStateModel): WithFrom {
    const { entries } = state;

    const last = entries.at(-1);

    if (last) {
      return { from: last.id };
    }

    return {};
  }
}
