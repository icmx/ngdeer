import { Inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { Theme } from '../enums/theme.enum';
import { DOCUMENT_DATASET } from '../providers/document-dataset.provider';

export type SettingsStateModel = {
  theme: Theme;
};

export const SETTINGS_STATE_TOKEN = new StateToken<SettingsStateModel>(
  'settings',
);

export class SetSettings {
  static readonly type = '[Settings] Set';

  constructor(public settings: SettingsStateModel) {}
}

@State<SettingsStateModel>({
  name: SETTINGS_STATE_TOKEN,
  defaults: {
    theme: Theme.Light,
  },
})
@Injectable()
export class SettingsState {
  constructor(
    @Inject(DOCUMENT_DATASET)
    private _documentDataset: DOMStringMap,
  ) {}

  @Action(SetSettings)
  setSettings(
    ctx: StateContext<SettingsStateModel>,
    { settings }: SetSettings,
  ): void {
    ctx.setState((prevState) => {
      const nextState = { ...prevState, ...settings };
      const theme = nextState.theme || Theme.Light;

      this._documentDataset['theme'] = theme;

      return nextState;
    });
  }
}
