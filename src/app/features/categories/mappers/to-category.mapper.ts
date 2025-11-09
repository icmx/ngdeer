import { ApiCategory } from '../models/api-category.model';
import { Category } from '../models/category.model';

export const toCategory = (category: ApiCategory): Category => {
  return {
    id: category.id.toString(),
    postsLink: `/categories/${category.id.toString()}/posts`,
    text: category.name?.trim() || '',
  };
};
