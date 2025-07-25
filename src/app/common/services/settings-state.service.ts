import { inject, Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme.enum';
import { DOCUMENT_DATASET } from '../providers/document-dataset.provider';
import { LOCAL_STORAGE } from '../providers/local-storage.provider';

export type SettingsStateModel = {
  theme: Theme;
};

@Injectable()
export class SettingsStateService {
  private _documentDataset = inject(DOCUMENT_DATASET);

  private _localStorage = inject(LOCAL_STORAGE);

  private _state = signal<SettingsStateModel>(this._getStorage());

  state = this._state.asReadonly();

  private _setDataset(value: SettingsStateModel): void {
    this._documentDataset['theme'] = value.theme;
  }

  /**
   * @todo This should be moved to a separate class if local storage
   * needs to be shared across multiple services
   */
  private _getStorage(): SettingsStateModel {
    const storageItem = this._localStorage.getItem('ngdeer:settings') || '{}';
    const storageValue = JSON.parse(storageItem);

    const value: SettingsStateModel = { theme: Theme.Light, ...storageValue };

    return value;
  }

  /**
   * @todo This should be moved to a separate class if local storage
   * needs to be shared across multiple services
   */
  private _setStorage(value: SettingsStateModel): void {
    const storageItem = JSON.stringify(value);

    this._localStorage.setItem('ngdeer:settings', storageItem);
  }

  setState(nextState: SettingsStateModel): void {
    this._state.update((prevState) => ({ ...prevState, ...nextState }));

    const state = this._state();

    this._setDataset(state);
    this._setStorage(state);
  }
}
