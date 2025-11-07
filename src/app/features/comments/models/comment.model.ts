import { User } from '../../users/models/user.model';

export type Comment = {
  id: string;
  rootId: null | string;
  postId: string;
  branch: null | Comment[];
  branchSize: null | number;
  timestamp: number;
  text: string;
  user: User;
};
