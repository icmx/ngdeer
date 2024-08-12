import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../providers/local-storage.provider';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _base = '/ngdeer';

  constructor(
    @Inject(LOCAL_STORAGE)
    private _localStorage: Storage,
  ) {}

  getItem<T>(key: string): null | T {
    try {
      const text = this._localStorage.getItem(`${this._base}/${key}`);

      if (!text) {
        return null;
      }

      const value = JSON.parse(text);

      return value;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const text = JSON.stringify(value);

      this._localStorage.setItem(`${this._base}/${key}`, text);
    } catch {
      // do nothing
    }
  }
}
