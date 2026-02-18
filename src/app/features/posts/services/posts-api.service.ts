import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import {
  RequestWithParams,
  RequestWithPath,
} from '../../../common/types/request-options.type';
import { WithApiCategory } from '../../categories/types/with-api-category.type';
import { WithApiPosts } from '../types/with-api-posts.type';
import { WithApiPost } from '../types/with-api-post.type';

export type GetPostByPostIdRequest = RequestWithPath<'postId'>;

export type GetPostsRequest = RequestWithParams<{
  from?: string;
  search_criteria?: string;
  category_id?: string;
  category_slug?: string;
  earlier?: string;
  later?: string;
}>;

export type GetPostsRandomRequest = RequestWithParams<{
  category_id?: string;
  category_slug?: string;
}>;

@Injectable({
  providedIn: 'root',
})
export class PostsApiService {
  private _http = inject(HttpClient);

  private _baseUrl = inject(BASE_URL);

  getPost({ path }: GetPostByPostIdRequest): Observable<WithApiPost> {
    return this._http.get<WithApiPost>(`${this._baseUrl}/posts/${path.postId}`);
  }

  getPosts({
    params,
  }: GetPostsRequest): Observable<WithApiPosts & WithApiCategory> {
    return this._http.get<WithApiPosts & WithApiCategory>(
      `${this._baseUrl}/posts`,
      { params },
    );
  }

  getPostsRandom({ params }: GetPostsRandomRequest): Observable<WithApiPosts> {
    return this._http.get<WithApiPosts>(`${this._baseUrl}/posts/random`, {
      params,
    });
  }
}
