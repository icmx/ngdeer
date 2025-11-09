import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DialogRef } from '../../../../common/classes/dialog-ref.class';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { DIALOG_DATA } from '../../../../common/services/dialog.service';
import { User } from '../../models/user.model';
import { HiddenUsersIdsService } from '../../services/hidden-users-ids.service';

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

  private _hiddenUsersIdsService = inject(HiddenUsersIdsService);

  user = inject<User>(DIALOG_DATA);

  shouldShowHideButton = computed(() => {
    return !this._hiddenUsersIdsService.ids().includes(this.user.id);
  });

  shouldShowShowButton = computed(() => {
    return this._hiddenUsersIdsService.ids().includes(this.user.id);
  });

  handleHideButtonClick(): void {
    this._hiddenUsersIdsService.add(this.user.id);
  }

  handleShowButtonClick(): void {
    this._hiddenUsersIdsService.remove(this.user.id);
  }

  handleButtonClick(): void {
    this._dialogRef.close(null);
  }
}
