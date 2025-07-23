import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, tap } from 'rxjs';
import { Category } from '../models/category.model';
import { extractCategoriesFromReply } from '../operators/extract-categories-from-reply.operator';
import { CategoriesApiService } from './categories-api.service';

export type CategoriesStateModel = {
  loading: boolean;
  done: boolean;
  entries: Category[];
};

@Injectable()
export class CategoriesStateService {
  private _destroyRef = inject(DestroyRef);

  private _categoriesApiService = inject(CategoriesApiService);

  private _state = signal<CategoriesStateModel>({
    loading: false,
    done: false,
    entries: [],
  });

  state = this._state.asReadonly();

  private _load(): void {
    of(null)
      .pipe(
        tap(() => {
          this._state.set({ loading: true, done: false, entries: [] });
        }),
        concatMap(() => {
          return this._categoriesApiService.getCategories();
        }),
        extractCategoriesFromReply(),
        tap((entries) => {
          this._state.set({ loading: false, done: true, entries });
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  load(): void {
    const { loading, done } = this._state();

    if (loading || done) {
      return;
    }

    this._load();
  }
}
