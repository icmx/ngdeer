export type Post = {
  id: string;
  text: string;
  timestamp: number;
  categoryId: string;
  categoryLink: `/categories/${string}`;
  categoryName: string;
  commentsCount: number;
  postLink: `/posts/${string}`;
};
