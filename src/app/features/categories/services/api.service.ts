import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WithApiCategories } from '../types/with-api-categories.type';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _baseUrl = 'https://podslyshano.com/api/v3.5';

  constructor(private _http: HttpClient) {}

  getCategories(): Observable<WithApiCategories> {
    return this._http.get<WithApiCategories>(`${this._baseUrl}/categories`);
  }
}
