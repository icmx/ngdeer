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
import { fromPostsReply } from '../mappers/from-posts-reply.mapper';
import { Post } from '../models/post.model';
import { ApiService, GetPostsRequestOptions } from './api.service';
import { UiService } from './ui.service';
import { WithText } from '../../../common/types/with-text.type';
import { WithCategoryId } from '../../../common/types/with-category-id.type';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _latestPosts = new DataStack<Post>();

  private _randomPosts = new DataStack<Post>();

  private _categoryPosts = new DataStack<Post>();

  private _searchPosts = new DataStack<Post>();

  constructor(
    private _apiService: ApiService,
    private _uiService: UiService,
  ) {}

  private _startLoading<T>(): MonoTypeOperatorFunction<T> {
    return tap(() => {
      this._uiService.startLoading();
    });
  }

  private _stopLoading<T>(): MonoTypeOperatorFunction<T> {
    return tap(() => {
      this._uiService.stopLoading();
    });
  }

  loadLatestPosts(params: WithFrom = {}): Observable<Post[]> {
    const data = this._latestPosts;

    return of(data.hasTag(params)).pipe(
      this._startLoading(),

      switchMap((hasTag) => {
        if (hasTag) {
          return of(data.getItems());
        }

        return this._apiService.getPosts({ params }).pipe(
          fromPostsReply(),
          map((next) => {
            return data
              .setItems((prev) => [...prev, ...next])
              .addTag(params)
              .getItems();
          }),
        );
      }),

      this._stopLoading(),
    );
  }

  loadRandomPosts(): Observable<Post[]> {
    const data = this._randomPosts;

    return of(null).pipe(
      this._startLoading(),

      switchMap(() => {
        return this._apiService.getPostsRandom().pipe(
          fromPostsReply(),
          map((next) => {
            return data.setItems((prev) => [...prev, ...next]).getItems();
          }),
        );
      }),

      this._stopLoading(),
    );
  }

  loadCategoryPosts(
    categoryId: string,
    params: WithFrom = {},
  ): Observable<Post[]> {
    const options: GetPostsRequestOptions = { params: {} };

    options.params!.category_id = categoryId;

    if (params.from) {
      options.params!.from = params.from;
    }

    const data = this._categoryPosts;

    return of(data.hasTag(options)).pipe(
      this._startLoading(),

      switchMap((hasTag) => {
        if (hasTag) {
          return of(data.getItems());
        }

        return this._apiService.getPosts(options).pipe(
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

        return this._apiService.getPosts(options).pipe(
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
    this._latestPosts.clear();
    this._randomPosts.clear();
    this._categoryPosts.clear();
    this._searchPosts.clear();
  }
}
