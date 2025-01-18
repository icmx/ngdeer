import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CaptionComponent } from '../../components/caption/caption.component';
import { ControlComponent } from '../../components/control/control.component';
import { FieldComponent } from '../../components/field/field.component';
import { Theme } from '../../enums/theme.enum';
import { SettingsService } from '../../services/settings.service';
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
    AsyncPipe,
    ReactiveFormsModule,
    FieldComponent,
    CaptionComponent,
    ControlComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  themes$ = this._themesService.getThemes();

  formGroup = new SettingsPageComponentFormGroup();

  constructor(
    private _settingsService: SettingsService,
    private _themesService: ThemesService,
  ) {
    const value = this._settingsService.getSettings();
    this.formGroup.setValue(value, { emitEvent: false });

    this.formGroup.controls.theme.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((theme) => {
        this._settingsService.setSettings({ theme });
      });
  }
}
