import { User } from '../../users/models/user.model';

export type Comment = {
  id: string;
  rootId: null | string;
  postId: string;
  branchSize: null | number;
  timestamp: number;
  text: string;
  user: User;
};
