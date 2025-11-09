import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../models/user.model';
import { UserDialogService } from '../user-dialog/user-dialog.service';

@Component({
  imports: [],
  selector: 'button[ngd-user-label]',
  templateUrl: './user-label.component.html',
  styleUrl: './user-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'handleClick()',
  },
})
export class UserLabelComponent {
  private _destroyRef = inject(DestroyRef);

  private _userDialogService = inject(UserDialogService);

  user = input.required<User>();

  handleClick(): void {
    this._userDialogService
      .open(this.user())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
