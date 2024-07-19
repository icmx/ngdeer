export type Post = {
  id: string;
  text: string;
  timestamp: number;
  commentsCount: number;
  commentsLink: `/posts/${string}/comments`;
  categoryName: string;
};
