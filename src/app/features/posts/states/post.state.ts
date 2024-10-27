import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Post } from '../models/post.model';
import { extractPostFromReply } from '../operators/extract-post-from-reply.operator';
import { PostsApiService } from '../services/posts-api.service';
import { PostsCacheService } from '../services/posts-cache.service';

export type PostStateModel = {
  loading: boolean;
  entry: Post | null;
};

export class LoadPost {
  static readonly type = '[Post] Load';

  constructor(public postId: string) {}
}

@State<PostStateModel>({
  name: 'post',
  defaults: {
    loading: false,
    entry: null,
  },
})
@Injectable()
export class PostState {
  constructor(
    private _postsApiService: PostsApiService,
    private _postsCacheService: PostsCacheService,
  ) {}

  @Action(LoadPost)
  loadEntry(
    ctx: StateContext<PostStateModel>,
    { postId }: LoadPost,
  ): Observable<Post> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true, entry: null });
      }),
      exhaustMap(() => {
        const cachedPost = this._postsCacheService.get(postId);

        if (cachedPost) {
          return of(cachedPost);
        }

        return this._postsApiService
          .getPost(postId)
          .pipe(extractPostFromReply());
      }),
      tap((entry) => {
        ctx.patchState({ loading: false, entry });
      }),
    );
  }
}

export class PostSelectors {
  @Selector([PostState])
  static loading(state: PostStateModel): boolean {
    return state.loading;
  }

  @Selector([PostState])
  static entry(state: PostStateModel): Post | null {
    return state.entry;
  }
}
