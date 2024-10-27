import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export type NgdButtonAppearance = 'default' | 'icon' | 'section';

@Component({
  selector: 'button[ngd-button]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input()
  set appearance(appearance: NgdButtonAppearance) {
    this.className = appearance;
  }

  @HostBinding('class')
  className: NgdButtonAppearance = 'default';
}
