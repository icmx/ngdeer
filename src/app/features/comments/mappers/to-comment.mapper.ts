import { ApiComment } from '../models/api-comment.model';
import { Comment } from '../models/comment.model';

export const defaultUsername = 'аноним';

/** Makes username string less distractive by removing emoji and such */
export const mute = (source: string | undefined): string => {
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
