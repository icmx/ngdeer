import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  finalize,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Category } from '../models/category.model';
import { extractCategoriesFromReply } from '../operators/extract-categories-from-reply.operator';
import { CategoriesApiService } from './categories-api.service';

@Injectable()
export class CategoriesStateService {
  private _destroyRef = inject(DestroyRef);

  private _categoriesApiService = inject(CategoriesApiService);

  private _load$ = new Subject<void>();

  private _isLoading = signal(false);

  private _isDone = signal(false);

  private _error = signal<string | null>(null);

  private _entries = signal<Category[]>([]);

  isLoading = this._isLoading.asReadonly();

  isDone = this._isDone.asReadonly();

  error = this._error.asReadonly();

  entries = this._entries.asReadonly();

  constructor() {
    this._setupLoad();
  }

  load(): void {
    if (this._isLoading() || this._isDone()) {
      return;
    }

    this._load$.next();
  }

  private _getEntries(): Observable<Category[]> {
    this._isLoading.set(true);
    this._isDone.set(false);
    this._entries.set([]);

    return this._categoriesApiService.getCategories().pipe(
      extractCategoriesFromReply(),
      tap((entries) => {
        this._isDone.set(true);
        this._entries.set(entries);
      }),
      catchError((error) => {
        this._error.set(error?.message || 'Failed while fetching categories');

        return EMPTY;
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  private _setupLoad(): void {
    this._load$
      .pipe(
        switchMap(() => {
          return this._getEntries();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
