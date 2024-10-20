import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import {
  CategoriesSelectors,
  LoadCategories,
} from '../states/categories.state';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _store: Store) {}

  selectLoading(): Observable<boolean> {
    return this._store.select(CategoriesSelectors.loading);
  }

  selectEntries(): Observable<Category[]> {
    return this._store.select(CategoriesSelectors.entries);
  }

  startLoading(): void {
    const canLoadEntries = this._store.selectSnapshot(
      CategoriesSelectors.canLoadEntries,
    );

    if (canLoadEntries) {
      this._store.dispatch(new LoadCategories());
    }
  }
}
