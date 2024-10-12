import { Injectable } from '@angular/core';
import {
  map,
  MonoTypeOperatorFunction,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { DataStack } from '../../../common/classes/data-stack.class';
import { WithFrom } from '../../../common/types/with-from.type';
import { WithText } from '../../../common/types/with-text.type';
import { WithCategoryId } from '../../../common/types/with-category-id.type';
import { fromPostsReply } from '../mappers/from-posts-reply.mapper';
import { Post } from '../models/post.model';
import { GetPostsRequestOptions, PostsApiService } from './posts-api.service';
import { PostsUiService } from './posts-ui.service';

@Injectable({
  providedIn: 'root',
})
export class PostsDataService {
  private _searchPosts = new DataStack<Post>();

  constructor(
    private _postsApiService: PostsApiService,
    private _postsUiService: PostsUiService,
  ) {}

  private _startLoading<T>(): MonoTypeOperatorFunction<T> {
    return tap(() => {
      this._postsUiService.startLoading();
    });
  }

  private _stopLoading<T>(): MonoTypeOperatorFunction<T> {
    return tap(() => {
      this._postsUiService.stopLoading();
    });
  }

  loadSearchPosts(
    params: WithText & WithFrom & WithCategoryId = {},
  ): Observable<Post[]> {
    const options: GetPostsRequestOptions = { params: {} };

    if (params.text) {
      options.params = { ...options.params, search_criteria: params.text };
    }

    if (params.from) {
      options.params = { ...options.params, from: params.from };
    }

    if (params.categoryId) {
      options.params = { ...options.params, category_id: params.categoryId };
    }

    const data = this._searchPosts;

    return of(data.hasTag(options)).pipe(
      this._startLoading(),

      switchMap((hasTag) => {
        if (hasTag) {
          return of(data.getItems());
        }

        return this._postsApiService.getPosts(options).pipe(
          fromPostsReply(),
          map((next) => {
            return data
              .setItems((prev) => [...prev, ...next])
              .addTag(options)
              .getItems();
          }),
        );
      }),

      this._stopLoading(),
    );
  }

  clear(): void {
    this._searchPosts.clear();
  }
}
