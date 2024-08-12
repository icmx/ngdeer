import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ThemesService } from '../../services/themes.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Theme } from '../../enums/theme.enum';
import { FieldComponent } from '../../components/field/field.component';
import { CaptionComponent } from '../../components/caption/caption.component';
import { ControlComponent } from '../../components/control/control.component';
import { AsyncPipe } from '@angular/common';

export type SettingsPageComponentFormGroupValue = {
  theme: FormControl<Theme>;
};

export class SettingsPageComponentFormGroup extends FormGroup<SettingsPageComponentFormGroupValue> {
  constructor() {
    super({
      theme: new FormControl(),
    });
  }
}

@Component({
  selector: 'ngd-settings-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    FieldComponent,
    CaptionComponent,
    ControlComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
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

    this.formGroup.controls.theme.valueChanges.subscribe((theme) => {
      this._settingsService.setSettings({ theme });
    });
  }
}
