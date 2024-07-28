import { map, Observable } from 'rxjs';
import { ApiComment } from '../models/api-comment.model';
import { Comment } from '../models/comment.model';
import { WithApiComments } from '../types/with-api-comments.type';

export const defaultUsername = 'аноним';

/** Makes username string less distractive by removinj emoji and such */
export const mute = (source: null | string): string => {
  if (!source) {
    return defaultUsername;
  }

  return (
    source
      .replace(/\P{Letter}/gu, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || defaultUsername
  );
};

export const toComment = () => {
  return (comment: ApiComment): Comment => {
    const username = mute(comment.user?.fullname);

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
