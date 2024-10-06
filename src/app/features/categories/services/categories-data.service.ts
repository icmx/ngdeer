import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { DataStack } from '../../../common/classes/data-stack.class';
import { fromCategoriesReply } from '../mappers/from-categories-reply.mapper';
import { Category } from '../models/category.model';
import { CategoriesApiService } from './categories-api.service';
import { CategoriesUiService } from './categories-ui.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesDataService {
  private _categories = new DataStack<Category>();

  constructor(
    private _categoriesApiService: CategoriesApiService,
    private _categoriesUiService: CategoriesUiService,
  ) {}

  loadCategories(): Observable<Category[]> {
    const data = this._categories;

    return of(data.hasItems()).pipe(
      tap(() => {
        this._categoriesUiService.startLoading();
      }),

      switchMap((hasItems) => {
        if (hasItems) {
          return of(data.getItems());
        }

        return this._categoriesApiService.getCategories().pipe(
          fromCategoriesReply(),
          tap((entries) => {
            this._categories.setItems(entries);
          }),
        );
      }),

      tap(() => {
        this._categoriesUiService.stopLoading();
      }),
    );
  }
}
