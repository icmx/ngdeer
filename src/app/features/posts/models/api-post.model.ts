import { ApiPostType } from '../enums/api-post-type.enum';

export type ApiPost =
  | {
      type: ApiPostType.Post;
      id: number;
      note: string;
      created_at: string;
      comments_count: number;
      category_id: number;
      category_name: string;
    }
  | {
      type: ApiPostType.Underside;
      id: number;
      note: string;
    };
