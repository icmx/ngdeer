import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { WithFrom } from '../../../common/types/with-from.type';
import { fromPostsReply } from '../mappers/from-posts-reply.mapper';
import { Post } from '../models/post.model';
import { PostsApiService } from '../services/posts-api.service';

export type LatestPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

export class LoadLatestPosts {
  static readonly type = '[LatestPosts] LoadLatest';

  constructor(public params: WithFrom = {}) {}
}

@State<LatestPostsStateModel>({
  name: 'latestPosts',
  defaults: {
    loading: false,
    entries: [],
  },
})
@Injectable()
export class LatestPostsState {
  constructor(private _postsApiService: PostsApiService) {}

  @Action(LoadLatestPosts)
  loadLatestPosts(
    ctx: StateContext<LatestPostsStateModel>,
    { params }: LoadLatestPosts,
  ): Observable<Post[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true });
      }),
      exhaustMap(() => {
        return this._postsApiService.getPosts({ params });
      }),
      fromPostsReply(),
      tap((nextEntries) => {
        const { entries: prevEntries } = ctx.getState();
        const entries = [...prevEntries, ...nextEntries];

        ctx.patchState({ loading: false, entries });
      }),
    );
  }
}

export class LatestPostsSelectors {
  @Selector([LatestPostsState])
  static loading(state: LatestPostsStateModel): boolean {
    return state.loading;
  }

  @Selector([LatestPostsState])
  static entries(state: LatestPostsStateModel): Post[] {
    return state.entries;
  }

  @Selector([LatestPostsState])
  static params(state: LatestPostsStateModel): WithFrom {
    const { entries } = state;

    const last = entries.at(-1);

    if (last) {
      return { from: last.id };
    }

    return {};
  }

  @Selector([LatestPostsState])
  static canLoad(state: LatestPostsStateModel): boolean {
    return state.entries.length === 0;
  }

  @Selector([LatestPostsState])
  static canLoadMore(state: LatestPostsStateModel): boolean {
    return state.entries.length > 0 && !state.loading;
  }
}
