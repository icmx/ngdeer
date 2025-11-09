import { DEPLOY_URL } from '../../../app.config';
import { ApiPostType } from '../enums/api-post-type.enum';
import { ApiPost } from '../models/api-post.model';
import { Post } from '../models/post.model';

export const toPost = (post: ApiPost): Post => {
  if (post.type === ApiPostType.Post) {
    const id = post.id.toString();
    const text = post.note || '';

    const contentToShare = [`Секрет #${id}`, text, `${DEPLOY_URL}/posts/${id}`]
      .filter((value) => !!value)
      .join('\n\n');

    return {
      id,
      link: `/posts/${id}`,
      text,
      timestamp: new Date(post.created_at).getTime(),
      commentsCount: post.comments_count,
      categoryId: post.category_id.toString(),
      categoryLink: `/categories/${post.category_id}/posts`,
      categoryName: post.category_name,
      contentToShare,
    };
  }

  throw new Error(`toPost: expected post.type 'post', not '${post.type}'`);
};
