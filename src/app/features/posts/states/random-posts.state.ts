import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Post } from '../models/post.model';
import { extractPostsFromReply } from '../operators/extract-posts-from-reply.operator';
import { PostsApiService } from '../services/posts-api.service';
import { PostsCacheService } from '../services/posts-cache.service';

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
  constructor(
    private _postsApiService: PostsApiService,
    private _postsCacheService: PostsCacheService,
  ) {}

  @Action(LoadRandomPosts)
  loadEntries(ctx: StateContext<RandomPostsStateModel>): Observable<Post[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true });
      }),
      exhaustMap(() => {
        return this._postsApiService.getPostsRandom();
      }),
      extractPostsFromReply(),
      tap((nextEntries) => {
        this._postsCacheService.add(...nextEntries);

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
