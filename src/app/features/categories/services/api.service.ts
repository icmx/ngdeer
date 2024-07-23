import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../common/providers/base-url.provider';
import { WithApiCategories } from '../types/with-api-categories.type';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private _http: HttpClient,
    @Inject(BASE_URL)
    private _baseUrl: string,
  ) {}

  getCategories(): Observable<WithApiCategories> {
    return this._http.get<WithApiCategories>(`${this._baseUrl}/categories`);
  }
}
