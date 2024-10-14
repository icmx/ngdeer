import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  SetSettings,
  SETTINGS_STATE_TOKEN,
  SettingsStateModel,
} from '../states/settings.state';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private _store: Store) {}

  getSettings(): SettingsStateModel {
    return this._store.selectSnapshot(SETTINGS_STATE_TOKEN);
  }

  setSettings(settings: SettingsStateModel): void {
    this._store.dispatch(new SetSettings(settings));
  }
}
