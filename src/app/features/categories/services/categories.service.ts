import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CategoriesSelectors,
  LoadCategories,
} from '../states/categories.state';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _store: Store) {}

  loading$ = this._store.select(CategoriesSelectors.loading);

  entries$ = this._store.select(CategoriesSelectors.entries);

  load() {
    const done = this._store.selectSnapshot(CategoriesSelectors.done);

    if (!done) {
      this._store.dispatch(new LoadCategories());
    }
  }
}
