import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesUiService {
  private _isLoading$ = new BehaviorSubject(false);

  isLoading$ = this._isLoading$.asObservable();

  startLoading() {
    this._isLoading$.next(true);
  }

  stopLoading() {
    this._isLoading$.next(false);
  }
}
