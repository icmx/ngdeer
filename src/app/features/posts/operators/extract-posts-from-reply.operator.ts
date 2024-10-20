import { map, Observable } from 'rxjs';
import { unique } from '../../../common/utils/unique.util';
import { ApiPostType } from '../enums/api-post-type.enum';
import { toPost } from '../mappers/to-post.mapper';
import { Post } from '../models/post.model';
import { WithApiPosts } from '../types/with-api-posts.type';

export const extractPostsFromReply = () => {
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
