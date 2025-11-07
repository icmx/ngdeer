import { ApiUser } from '../models/api-user.model';
import { User } from '../models/user.model';

export const toUserMutedFullname = (user: ApiUser): string => {
  if (/^аноним\d*?$/i.test(user.fullname)) {
    return user.fullname.toLowerCase().replace('аноним', 'аноним-');
  }

  return user.fullname
    .toLowerCase()
    .replace(/\P{Letter}/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const toUser = (user: ApiUser): User => {
  return {
    id: user.id.toString(),
    fullname: '@' + toUserMutedFullname(user),
    location: user.location || '',
    bio: user.bio || '',
  };
};
