import { map, Observable } from 'rxjs';
import { unique } from '../../../common/utils/unique.util';
import { ApiPostType } from '../enums/api-post-type.enum';
import { ApiPost } from '../models/api-post.model';
import { Post } from '../models/post.model';
import { WithApiPosts } from '../types/with-api-posts.type';

export const toPost = () => {
  return (post: ApiPost): Post => {
    if (post.type === ApiPostType.Post) {
      return {
        id: post.id.toString(),
        text: post.note || '',
        timestamp: new Date(post.created_at).getTime(),
        commentsCount: post.comments_count,
        commentsLink: `/posts/${post.id}/comments`,
        categoryId: post.category_id.toString(),
        categoryLink: `/categories/${post.category_id}/posts`,
        categoryName: post.category_name,
      };
    }

    throw new Error(`Expected post.type 'post', was ${post.type}`);
  };
};

export const fromPostsReply = () => {
  return (source$: Observable<WithApiPosts>): Observable<Post[]> => {
    return source$.pipe(
      map((reply) => {
        return (reply.posts || [])
          .filter((post) => post.type === ApiPostType.Post && !!post.note)
          .filter(unique({ by: (post) => post.id }))
          .map(toPost());
      }),
    );
  };
};
