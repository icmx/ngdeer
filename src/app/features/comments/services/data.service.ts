import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable, tap } from 'rxjs';
import { WithLater } from '../../../common/types/with-later-type';
import { fromCommentsReply } from '../mappers/from-comments-reply.mapper';
import { Comment } from '../models/comment.model';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private _apiService: ApiService,
    private _uiService: UiService,
  ) {}

  loadComments(postId: string, params: WithLater = {}): Observable<Comment[]> {
    this._uiService.startLoading();

    return this._apiService.getPostComments(postId, { params }).pipe(
      fromCommentsReply(),
      map((prevComments) => {
        const nextComments: Comment[] = [];

        prevComments.forEach((prevComment) => {
          if (!prevComment.rootId) {
            nextComments.push(prevComment);
          }

          const rootComment = nextComments.find(
            (nextComment) => nextComment.id === prevComment.rootId,
          );

          if (rootComment) {
            rootComment.branch = rootComment.branch || [];

            rootComment.branch.push(prevComment);
          }
        });

        return nextComments;
      }),
      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }

  loadBranch(rootCommentId: string): Observable<Comment[]> {
    this._uiService.startBranchLoading(rootCommentId);

    return this._apiService.getCommentBranch(rootCommentId).pipe(
      fromCommentsReply(),
      tap(() => {
        this._uiService.stopBranchLoading();
      }),
    );
  }
}
