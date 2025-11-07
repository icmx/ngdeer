import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '../../../../common/classes/dialog-ref.class';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { DIALOG_DATA } from '../../../../common/services/dialog.service';
import { User } from '../../models/user.model';

/**
 * @todo Add user hiding
 */
@Component({
  imports: [
    // Internal Imports
    ButtonComponent,
  ],
  selector: 'ngd-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent {
  private _dialogRef = inject(DialogRef);

  user = inject<User>(DIALOG_DATA);

  handleButtonClick(): void {
    this._dialogRef.close(null);
  }
}
