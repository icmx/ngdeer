import { map, Observable } from 'rxjs';
import { toPost } from '../mappers/to-post.mapper';
import { Post } from '../models/post.model';
import { WithApiPost } from '../types/with-api-post.type';

export const extractPostFromReply = () => {
  return (source$: Observable<WithApiPost>): Observable<Post> => {
    return source$.pipe(map((reply) => toPost()(reply.post)));
  };
};
