import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ScrollPosition } from '../../../common/types/scroll-position.type';
import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { PostsApiService } from '../services/posts-api.service';
import { WithFrom } from '../../../common/types/with-from.type';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { fromPostsReply } from '../mappers/from-posts-reply.mapper';

export type LatestPostsStateModel = {
  loading: boolean;
  entries: Post[];
  scrollPosition: ScrollPosition;
};

export class LoadLatestPosts {
  static readonly type = '[Latest Posts] LoadLatestPosts';

  constructor(public params: WithFrom = {}) {}
}

@State<LatestPostsStateModel>({
  name: 'latestPosts',
  defaults: {
    loading: false,
    entries: [],
    scrollPosition: [0, 0],
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
