import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { Persistence } from '../classes/persistence.class';
import { Theme } from '../enums/theme.enum';
import { DOCUMENT_DATASET } from '../providers/document-dataset.provider';
import { ThemeItem } from '../types/theme-item.type';

export const THEME_PERSISTENCE = new InjectionToken<Persistence<Theme>>(
  'THEME',
  {
    factory: (): Persistence<Theme> => {
      return new Persistence({
        key: 'ngdeer:theme',
        initialValue: Theme.System,
      });
    },
  },
);

@Injectable()
export class ThemesService {
  private _dataset = inject(DOCUMENT_DATASET);

  private _persistence = inject(THEME_PERSISTENCE);

  private _themeItems = signal<ThemeItem[]>([
    { text: 'Как в системе', value: Theme.System },
    { text: 'Светлая', value: Theme.Light },
    { text: 'Темная', value: Theme.Dark },
  ]);

  themeItems = this._themeItems.asReadonly();

  theme = this._persistence.value;

  setTheme(theme: Theme): void {
    this._persistence.setValue(theme);
    this._dataset['theme'] = theme;
  }
}
