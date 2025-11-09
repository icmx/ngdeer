import { DestroyRef, inject, Injectable } from '@angular/core';
import { DialogService } from '../../../../common/services/dialog.service';
import { User } from '../../models/user.model';
import { UserDialogComponent } from './user-dialog.component';
import { exhaustMap, Observable, of } from 'rxjs';

@Injectable()
export class UserDialogService {
  private _dialogService = inject(DialogService);

  open(user: User): Observable<null> {
    return of(null).pipe(
      exhaustMap(() => {
        return this._dialogService
          .open<UserDialogComponent, User, null>(UserDialogComponent, {
            config: { appearance: 'modal' },
            data: user,
          })
          .afterClosed();
      }),
    );
  }
}
