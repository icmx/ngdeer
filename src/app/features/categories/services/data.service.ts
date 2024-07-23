import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { DataStack } from '../../../common/classes/data-stack.class';
import { fromCategoriesReply } from '../mappers/from-categories-reply.mapper';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _categories = new DataStack<Category>();

  constructor(
    private _apiService: ApiService,
    private _uiService: UiService,
  ) {}

  loadCategories(): Observable<Category[]> {
    const data = this._categories;

    return of(data.hasItems()).pipe(
      tap(() => {
        this._uiService.startLoading();
      }),

      switchMap((hasItems) => {
        if (hasItems) {
          return of(data.getItems());
        }

        return this._apiService.getCategories().pipe(
          fromCategoriesReply(),
          tap((entries) => {
            this._categories.setItems(entries);
          }),
        );
      }),

      tap(() => {
        this._uiService.stopLoading();
      }),
    );
  }
}
