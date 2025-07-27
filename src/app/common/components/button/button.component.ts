import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  input,
} from '@angular/core';

export type NgdButtonAppearance = 'default' | 'icon' | 'section';

@Component({
  imports: [],
  selector: 'button[ngd-button]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  appearance = input<NgdButtonAppearance>('default');

  constructor() {
    effect(() => {
      this.className = this.appearance();
    });
  }

  @HostBinding('class')
  className: NgdButtonAppearance = 'default';
}
