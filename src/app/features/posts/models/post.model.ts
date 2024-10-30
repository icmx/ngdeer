export type Post = {
  id: string;
  link: `/posts/${string}`;
  text: string;
  timestamp: number;
  categoryId: string;
  categoryLink: `/categories/${string}`;
  categoryName: string;
  commentsCount: number;
  contentToShare: string;
};
