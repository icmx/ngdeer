import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { fromPostsReply } from '../mappers/from-posts-reply.mapper';
import { Post } from '../models/post.model';
import { PostsApiService } from '../services/posts-api.service';

export type RandomPostsStateModel = {
  loading: boolean;
  entries: Post[];
};

export class LoadRandomPosts {
  static readonly type = '[RandomPosts] Load';
}

@State<RandomPostsStateModel>({
  name: 'randomPosts',
  defaults: {
    loading: false,
    entries: [],
  },
})
@Injectable()
export class RandomPostsState {
  constructor(private _postsApiService: PostsApiService) {}

  @Action(LoadRandomPosts)
  loadRandomPosts(
    ctx: StateContext<RandomPostsStateModel>,
  ): Observable<Post[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true });
      }),
      exhaustMap(() => {
        return this._postsApiService.getPostsRandom();
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

export class RandomPostsSelectors {
  @Selector([RandomPostsState])
  static loading(state: RandomPostsStateModel): boolean {
    return state.loading;
  }

  @Selector([RandomPostsState])
  static entries(state: RandomPostsStateModel): Post[] {
    return state.entries;
  }

  @Selector([RandomPostsState])
  static canLoad(state: RandomPostsStateModel): boolean {
    return state.entries.length === 0;
  }

  @Selector([RandomPostsState])
  static canLoadMore(state: RandomPostsStateModel): boolean {
    return state.entries.length > 0 && !state.loading;
  }
}
