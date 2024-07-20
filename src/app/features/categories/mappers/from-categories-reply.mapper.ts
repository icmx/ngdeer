import { map, Observable } from 'rxjs';
import { ApiCategory } from '../models/api-category.model';
import { Category } from '../models/category.model';
import { WithApiCategories } from '../types/with-api-categories.type';

export const toCategory = () => {
  return (category: ApiCategory): Category => {
    return {
      id: category.id.toString(),
      postsLink: `/categories/${category.id.toString()}/posts`,
      text: category.name?.trim() || '',
    };
  };
};

export const fromCategoriesReply = () => {
  return (source$: Observable<WithApiCategories>): Observable<Category[]> => {
    return source$.pipe(
      map((reply) => {
        return (reply.categories || []).map(toCategory());
      }),
    );
  };
};
