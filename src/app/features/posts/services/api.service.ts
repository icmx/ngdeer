import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions } from '../../../common/types/request-options.type';
import { Param } from '../../../common/types/param.type';
import { WithApiCategory } from '../../categories/types/with-api-category.type';
import { WithApiPosts } from '../types/with-api-posts.type';

export type GetPostsRequestOptions = RequestOptions<{
  params: {
    from?: Param;
    search_criteria?: string;
    category_id?: Param;
    category_slug?: string;
    earlier?: Param;
    later?: Param;
  };
}>;

export type GetPostsRandomRequestOptions = RequestOptions<{
  params: {
    category_id?: Param;
    category_slug?: Param;
  };
}>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _baseUrl = 'https://podslyshano.com/api/v3.5';

  constructor(private _http: HttpClient) {}

  getPosts(
    options?: GetPostsRequestOptions,
  ): Observable<WithApiPosts & WithApiCategory> {
    return this._http.get<WithApiPosts & WithApiCategory>(
      `${this._baseUrl}/posts`,
      options,
    );
  }

  getPostsRandom(
    options?: GetPostsRandomRequestOptions,
  ): Observable<WithApiPosts> {
    return this._http.get<WithApiPosts>(
      `${this._baseUrl}/posts/random`,
      options,
    );
  }
}
