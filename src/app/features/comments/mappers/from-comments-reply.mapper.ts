import { map, Observable } from 'rxjs';
import { ApiComment } from '../models/api-comment.model';
import { Comment } from '../models/comment.model';
import { WithApiComments } from '../types/with-api-comments.type';

export const toComment = () => {
  return (comment: ApiComment): Comment => {
    const username =
      (comment.user.fullname || '')
        .toLowerCase()
        .replace(/\p{Emoji_Presentation}/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-*?\d*?$/, '')
        .trim() || 'аноним';

    return {
      id: comment.id.toString(),
      rootId: comment.root_id?.toString() || null,
      postId: comment.post_id.toString(),
      branch: null,
      branchSize: comment.branch_size,
      text: comment.text_fixed?.trim() || '',
      username: `@${username}`,
      timestamp: new Date(comment.created_at).getTime(),
    };
  };
};

export const fromCommentsReply = () => {
  return (source$: Observable<WithApiComments>): Observable<Comment[]> => {
    return source$.pipe(
      map((reply) => {
        return (reply.comments || []).map(toComment());
      }),
    );
  };
};
