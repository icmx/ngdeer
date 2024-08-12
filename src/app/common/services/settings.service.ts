import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme } from '../enums/theme.enum';
import { StorageService } from './storage.service';
import { Settings } from '../types/settings.type';

const THEME_KEY = 'theme';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    @Inject(DOCUMENT)
    private _document: Document,
    private _storageService: StorageService,
  ) {}

  getSettings(): Settings {
    const theme = this._storageService.getItem<Theme>(THEME_KEY) || Theme.Light;

    return { theme };
  }

  setSettings(settings: Settings): void {
    const theme = settings?.[THEME_KEY] || Theme.Light;

    this._storageService.setItem<Theme>(THEME_KEY, theme);

    console.log(this._document);

    const dataset = this._document?.documentElement?.dataset || {};

    dataset[THEME_KEY] = theme;
  }
}
