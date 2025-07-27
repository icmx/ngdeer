import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { createId } from '../../utils/get-id.util';

@Component({
  imports: [],
  selector: 'input[ngdControl],select[ngdControl]',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  @HostBinding('attr.id')
  attrId = createId();
}
