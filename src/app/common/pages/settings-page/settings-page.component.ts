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
import { CaptionComponent } from '../../components/caption/caption.component';
import { ControlComponent } from '../../components/control/control.component';
import { FieldComponent } from '../../components/field/field.component';
import { Theme } from '../../enums/theme.enum';
import { SettingsStateService } from '../../services/settings-state.service';
import { ThemesService } from '../../services/themes.service';

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
  selector: 'ngd-settings-page',
  imports: [
    // Angular Imports
    ReactiveFormsModule,
    FieldComponent,
    CaptionComponent,
    ControlComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  private _settingsStateService = inject(SettingsStateService);

  themesSignal = computed(() => this._themesService.value());

  formGroup = new SettingsPageComponentFormGroup();

  constructor(
    private _destoryRef: DestroyRef,
    private _themesService: ThemesService,
  ) {
    const value = this._settingsStateService.state();
    this.formGroup.setValue(value, { emitEvent: false });
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        tap((value) => {
          this._settingsStateService.setState({ theme: Theme.Light, ...value });
        }),
        takeUntilDestroyed(this._destoryRef),
      )
      .subscribe();
  }
}
