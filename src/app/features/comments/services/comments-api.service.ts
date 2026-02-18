import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import {
  RequestWithParams,
  RequestWithPath,
} from '../../../common/types/request-options.type';
import { WithApiComments } from '../types/with-api-comments.type';
import { WithApiRootComment } from '../types/with-api-root-comment.type';

export type GetPostsCommentsByPostIdRequest = RequestWithPath<'postId'> &
  RequestWithParams<{ earlier?: string; later?: string }>;

export type GetCommentsBranchByRootCommentIdRequest =
  RequestWithPath<'rootCommentId'> &
    RequestWithParams<{ earlier?: string; later?: string }>;

export type GetCommentsForUserByUserIdRequest = RequestWithPath<'userId'>;

@Injectable({
  providedIn: 'root',
})
export class CommentsApiService {
  private _http = inject(HttpClient);

  private _baseUrl = inject(BASE_URL);

  getPostsCommentsByPostId({
    path,
    params,
  }: GetPostsCommentsByPostIdRequest): Observable<WithApiComments> {
    return this._http.get<WithApiComments>(
      `${this._baseUrl}/posts/${path.postId}/comments`,
      { params },
    );
  }

  getCommentsBranchByRootCommentId({
    path,
    params,
  }: GetCommentsBranchByRootCommentIdRequest): Observable<
    WithApiComments & WithApiRootComment
  > {
    return this._http.get<WithApiComments & WithApiRootComment>(
      `${this._baseUrl}/comments/branch/${path.rootCommentId}`,
      { params },
    );
  }

  /**
   * @todo This will be used later
   */
  getCommentsForUserByUserId({
    path,
  }: GetCommentsForUserByUserIdRequest): Observable<WithApiComments> {
    return this._http.get<WithApiComments>(
      `${this._baseUrl}/comments/for_user/${path.userId}`,
    );
  }
}
