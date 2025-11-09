import { DestroyRef, inject, Injectable, InjectionToken } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { exhaustMap, filter, of, tap } from 'rxjs';
import { Persistence } from '../classes/persistence.class';
import { DisclaimerComponent } from '../components/disclaimer/disclaimer.component';
import { DialogService } from './dialog.service';

export const IS_DISCLAIMER_SHOWN_PERSISTENCE = new InjectionToken<
  Persistence<boolean>
>('IS_DISCLAIMER_SHOWN_PERSISTENCE', {
  factory: (): Persistence<boolean> => {
    return new Persistence({
      key: 'ngdeer:isDisclaimerShown',
      initialValue: false,
    });
  },
});

@Injectable()
export class DisclaimerService {
  private _destroyRef = inject(DestroyRef);

  private _dialogService = inject(DialogService);

  private _persistence = inject(IS_DISCLAIMER_SHOWN_PERSISTENCE);

  disclaim(): void {
    of(null)
      .pipe(
        filter(() => {
          const isDisclaimerShown = this._persistence.value();

          return !isDisclaimerShown;
        }),
        exhaustMap(() => {
          return this._dialogService
            .open(DisclaimerComponent, { config: { appearance: 'toast' } })
            .afterClosed();
        }),
        tap(() => {
          this._persistence.setValue(true);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
