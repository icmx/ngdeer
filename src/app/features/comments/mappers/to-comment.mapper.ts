import { toUser } from '../../users/mappers/to-user.mapper';
import { ApiComment } from '../models/api-comment.model';
import { Comment } from '../models/comment.model';

export const toComment = (comment: ApiComment): Comment => {
  return {
    id: comment.id.toString(),
    rootId: comment.root_id?.toString() || null,
    postId: comment.post_id.toString(),
    branch: null,
    branchSize: comment.branch_size,
    text: comment.text_fixed?.trim() || '',
    timestamp: new Date(comment.created_at).getTime(),
    user: toUser(comment.user),
  };
};
