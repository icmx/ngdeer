import { inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../providers/local-storage.provider';

@Injectable()
export class LocalStorageService {
  private _localStorage = inject(LOCAL_STORAGE);

  getItem<T>(key: string): T | null {
    const text = this._localStorage.getItem(key);

    if (text === null) {
      return null;
    }

    return JSON.parse(text);
  }

  setItem<T>(key: string, value: T): void {
    const text = JSON.stringify(value);

    this._localStorage.setItem(key, text);
  }
}
