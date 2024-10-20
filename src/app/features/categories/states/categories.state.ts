import { Injectable } from '@angular/core';
import { exhaustMap, Observable, of, tap } from 'rxjs';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Category } from '../models/category.model';
import { extractCategoriesFromReply } from '../operators/extract-categories-from-reply.operator';
import { CategoriesApiService } from '../services/categories-api.service';

export type CategoriesStateModel = {
  loading: boolean;
  done: boolean;
  entries: Category[];
};

export class LoadCategories {
  static readonly type = '[Categories] LoadCategories';
}

@State<CategoriesStateModel>({
  name: 'categories',
  defaults: {
    loading: false,
    done: false,
    entries: [],
  },
})
@Injectable()
export class CategoriesState {
  constructor(private _categoriesApiService: CategoriesApiService) {}

  @Action(LoadCategories)
  loadEntries(
    ctx: StateContext<CategoriesStateModel>,
  ): Observable<Category[]> {
    return of(null).pipe(
      tap(() => {
        ctx.patchState({ loading: true, done: false, entries: [] });
      }),
      exhaustMap(() => this._categoriesApiService.getCategories()),
      extractCategoriesFromReply(),
      tap((entries) => {
        ctx.patchState({ loading: false, done: true, entries });
      }),
    );
  }
}

export class CategoriesSelectors {
  @Selector([CategoriesState])
  static loading(state: CategoriesStateModel): boolean {
    return state.loading;
  }

  @Selector([CategoriesState])
  static entries(state: CategoriesStateModel): Category[] {
    return state.entries;
  }

  @Selector([CategoriesState])
  static canLoadEntries(state: CategoriesStateModel): boolean {
    return !state.done;
  }
}
