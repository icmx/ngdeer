import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { exhaustMap, filter, of, tap } from 'rxjs';
import { DisclaimerComponent } from '../components/disclaimer/disclaimer.component';
import { DialogService } from './dialog.service';
import { SettingsStateService } from './settings-state.service';

@Injectable({
  providedIn: 'root',
})
export class DisclaimerService {
  private _destroyRef = inject(DestroyRef);

  private _dialogService = inject(DialogService);

  private _settingsStateService = inject(SettingsStateService);

  disclaim(): void {
    of(null)
      .pipe(
        filter(() => {
          const { isDisclaimerShown } = this._settingsStateService.state();

          return !isDisclaimerShown;
        }),
        exhaustMap(() => {
          return this._dialogService
            .open(DisclaimerComponent, { config: { appearance: 'toast' } })
            .afterClosed();
        }),
        tap(() => {
          this._settingsStateService.setState((state) => ({
            ...state,
            isDisclaimerShown: true,
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
