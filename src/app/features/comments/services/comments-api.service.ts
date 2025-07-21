import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import { RequestOptions } from '../../../common/types/request-options.type';
import { Param } from '../../../common/types/param.type';
import { WithApiComments } from '../types/with-api-comments.type';
import { WithApiRootComment } from '../types/with-api-root-comment.type';

export type GetPostCommentsOptions = RequestOptions<{
  params: { earlier?: Param; later?: Param };
}>;

@Injectable({
  providedIn: 'root',
})
export class CommentsApiService {
  private _http = inject(HttpClient);

  private _baseUrl = inject(BASE_URL);

  getPostComments(
    postId: Param,
    options?: GetPostCommentsOptions,
  ): Observable<WithApiComments> {
    return this._http.get<WithApiComments>(
      `${this._baseUrl}/posts/${postId}/comments`,
      options,
    );
  }

  getCommentBranch(
    rootCommentId: Param,
  ): Observable<WithApiComments & WithApiRootComment> {
    return this._http.get<WithApiComments & WithApiRootComment>(
      `${this._baseUrl}/comments/branch/${rootCommentId}`,
    );
  }
}
