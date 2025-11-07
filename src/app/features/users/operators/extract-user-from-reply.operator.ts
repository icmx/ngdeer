import { map, Observable } from 'rxjs';
import { toUser } from '../mappers/to-user.mapper';
import { User } from '../models/user.model';
import { WithApiUser } from '../types/with-api-user.type';

export const extractUserFromReply = () => {
  return (source$: Observable<WithApiUser>): Observable<User> => {
    return source$.pipe(map((reply) => toUser(reply.user)));
  };
};
