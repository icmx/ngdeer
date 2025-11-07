import { ApiUser } from '../../users/models/api-user.model';

export type ApiComment = {
  id: number;
  parent_id: null | number;
  root_id: null | number;
  post_id: number;
  created_at: string;
  text_fixed: string;
  branch_size: null | number;
  user: ApiUser;
};
