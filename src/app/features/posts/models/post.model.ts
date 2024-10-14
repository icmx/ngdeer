export type Post = {
  id: string;
  text: string;
  timestamp: number;
  commentsCount: number;
  categoryId: string;
  categoryLink: `/categories/${string}`;
  commentsLink: `/posts/${string}/comments`;
  categoryName: string;
};
