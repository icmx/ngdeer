import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { HiddenUsersIdsService } from '../../../features/users/services/hidden-users-ids.service';
import { UsersStateService } from '../../../features/users/services/users-state.service';
import { UserLabelComponent } from '../../../features/users/components/user-label/user-label.component';
import { CaptionComponent } from '../../components/caption/caption.component';
import { ControlComponent } from '../../components/control/control.component';
import { FieldComponent } from '../../components/field/field.component';
import { ThemesService } from '../../services/themes.service';
import { Theme } from '../../enums/theme.enum';

export class SettingsPageComponentFormGroup extends FormGroup<{
  theme: FormControl<Theme>;
}> {
  constructor() {
    super({
      theme: new FormControl(Theme.Light, { nonNullable: true }),
    });
  }
}

@Component({
  imports: [
    // Angular Imports
    ReactiveFormsModule,
    FieldComponent,
    CaptionComponent,
    ControlComponent,

    // Internal Imports
    UserLabelComponent,
  ],
  selector: 'ngd-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _themesService = inject(ThemesService);

  private _hiddenUsersIdsService = inject(HiddenUsersIdsService);

  private _usersStateService = inject(UsersStateService);

  themes = computed(() => this._themesService.themeItems());

  hiddenUsers = computed(() => {
    const ids = this._hiddenUsersIdsService.ids();
    const users = this._usersStateService.entries();

    return users.filter((user) => ids.includes(user.id));
  });

  formGroup = new SettingsPageComponentFormGroup();

  constructor() {
    const theme = this._themesService.theme();
    this.formGroup.controls.theme.setValue(theme);
  }

  ngOnInit(): void {
    this.formGroup.controls.theme.valueChanges
      .pipe(
        tap((theme) => {
          this._themesService.setTheme(theme);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._hiddenUsersIdsService.ids().forEach((id) => {
      this._usersStateService.load(id);
    });
  }
}
