import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgdButtonAppearance = 'default' | 'icon' | 'section';

@Component({
  imports: [],
  selector: 'button[ngd-button]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class]': 'appearance()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  appearance = input<NgdButtonAppearance>('default');
}
