import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { WithLater } from '../../../common/types/with-later-type';
import { fromCommentsReply } from '../mappers/from-comments-reply.mapper';
import { Comment } from '../models/comment.model';
import { CommentsUiService } from './comments-ui.service';
import { CommentsApiService } from './comments-api.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsDataService {
  constructor(
    private _commentsApiService: CommentsApiService,
    private _commentsUiService: CommentsUiService,
  ) {}

  loadComments(postId: string, params: WithLater = {}): Observable<Comment[]> {
    this._commentsUiService.startLoading();

    return this._commentsApiService.getPostComments(postId, { params }).pipe(
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
        this._commentsUiService.stopLoading();
      }),
    );
  }

  loadBranch(rootCommentId: string): Observable<Comment[]> {
    this._commentsUiService.startBranchLoading(rootCommentId);

    return this._commentsApiService.getCommentBranch(rootCommentId).pipe(
      fromCommentsReply(),
      tap(() => {
        this._commentsUiService.stopBranchLoading();
      }),
    );
  }
}
