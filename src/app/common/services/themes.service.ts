import { Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme.enum';
import { ThemeItem } from '../types/theme-item.type';

@Injectable()
export class ThemesService {
  private _value = signal<ThemeItem[]>([
    { text: 'Как в системе', value: Theme.System },
    { text: 'Светлая', value: Theme.Light },
    { text: 'Темная', value: Theme.Dark },
  ]);

  value = this._value.asReadonly();
}
