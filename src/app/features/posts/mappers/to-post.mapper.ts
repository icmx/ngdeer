import { ApiPostType } from '../enums/api-post-type.enum';
import { ApiPost } from '../models/api-post.model';
import { Post } from '../models/post.model';

export const toPost = () => {
  return (post: ApiPost): Post => {
    if (post.type === ApiPostType.Post) {
      return {
        id: post.id.toString(),
        text: post.note || '',
        timestamp: new Date(post.created_at).getTime(),
        commentsCount: post.comments_count,
        categoryId: post.category_id.toString(),
        categoryLink: `/categories/${post.category_id}/posts`,
        categoryName: post.category_name,
        postLink: `/posts/${post.id}`,
      };
    }

    throw new Error(`toPost: expected post.type 'post', not '${post.type}'`);
  };
};
