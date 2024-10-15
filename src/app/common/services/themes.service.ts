import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Theme } from '../enums/theme.enum';
import { ThemeItem } from '../types/theme-item.type';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  getThemes(): Observable<ThemeItem[]> {
    return of([
      { text: 'Как в системе', value: Theme.System },
      { text: 'Светлая', value: Theme.Light },
      { text: 'Темная', value: Theme.Dark },
    ]);
  }
}
