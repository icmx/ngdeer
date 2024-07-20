import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { DataStack } from '../../../common/classes/data-stack.class';
import { fromCategoriesReply } from '../mappers/from-categories-reply.mapper';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _categoriesData = new DataStack<Category>();

  constructor(
    private _apiService: ApiService,
    private _uiService: UiService,
  ) {}

  loadCategories(): Observable<Category[]> {
    this._uiService.startLoading();

    if (this._categoriesData.hasItems()) {
      return of(this._categoriesData.getItems());
    }

    return this._apiService.getCategories().pipe(
      fromCategoriesReply(),
      tap((entries) => {
        this._categoriesData.setItems(entries);
        this._uiService.stopLoading();
      }),
    );
  }
}
