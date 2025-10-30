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

  private _isLoading = signal(false);

  private _isDone = signal(false);

  private _entries = signal<Category[]>([]);

  isLoading = this._isLoading.asReadonly();

  isDone = this._isDone.asReadonly();

  entries = this._entries.asReadonly();

  private _load(): void {
    of(null)
      .pipe(
        tap(() => {
          this._isLoading.set(true);
          this._isDone.set(false);
          this._entries.set([]);
        }),
        concatMap(() => {
          return this._categoriesApiService.getCategories();
        }),
        extractCategoriesFromReply(),
        tap((entries) => {
          this._isLoading.set(false);
          this._isDone.set(true);
          this._entries.set(entries);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  load(): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    this._load();
  }
}
