import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import { WithApiCategories } from '../types/with-api-categories.type';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private _http = inject(HttpClient);

  private _baseUrl = inject(BASE_URL);

  getCategories(): Observable<WithApiCategories> {
    return this._http.get<WithApiCategories>(`${this._baseUrl}/categories`);
  }
}
