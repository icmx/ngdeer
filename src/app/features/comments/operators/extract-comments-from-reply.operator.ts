import { map, Observable } from 'rxjs';
import { toComment } from '../mappers/to-comment.mapper';
import { Comment } from '../models/comment.model';
import { WithApiComments } from '../types/with-api-comments.type';

export const extractCommentsFromReply = () => {
  return (source$: Observable<WithApiComments>): Observable<Comment[]> => {
    return source$.pipe(
      map((reply) => {
        return (reply.comments || []).map(toComment);
      }),
    );
  };
};
