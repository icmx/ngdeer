import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
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

  loadLatestPosts(params: WithFrom = {}): Observable<Post[]> {
    this._uiService.startLoading();

    const data = this._latestPosts;

    if (data.hasTag(params)) {
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
      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }

  loadRandomPosts(): Observable<Post[]> {
    this._uiService.startLoading();

    const data = this._randomPosts;

    return this._apiService.getPostsRandom().pipe(
      fromPostsReply(),
      map((next) => {
        return data.setItems((prev) => [...prev, ...next]).getItems();
      }),
      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }

  loadCategoryPosts(
    categoryId: string,
    params: WithFrom = {},
  ): Observable<Post[]> {
    this._uiService.startLoading();

    const data = this._categoryPosts;
    const options: GetPostsRequestOptions = { params: {} };

    options.params!.category_id = categoryId;

    if (params.from) {
      options.params!.from = params.from;
    }

    if (data.hasTag(options)) {
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
      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }

  loadSearchPosts(
    params: WithText & WithFrom & WithCategoryId = {},
  ): Observable<Post[]> {
    this._uiService.startLoading();

    const data = this._searchPosts;
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

    if (data.hasTag(options)) {
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
      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }

  clear(): void {
    this._latestPosts.clear();
    this._randomPosts.clear();
    this._categoryPosts.clear();
    this._searchPosts.clear();
  }
}