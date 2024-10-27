import { map, Observable } from 'rxjs';
import { toCategory } from '../mappers/to-category.mapper';
import { Category } from '../models/category.model';
import { WithApiCategories } from '../types/with-api-categories.type';

export const extractCategoriesFromReply = () => {
  return (source$: Observable<WithApiCategories>): Observable<Category[]> => {
    return source$.pipe(
      map((reply) => {
        return (reply.categories || []).map(toCategory());
      }),
    );
  };
};
