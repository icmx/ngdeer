import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createId } from '../../utils/get-id.util';

@Component({
  imports: [],
  selector: 'input[ngdControl],select[ngdControl]',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  host: {
    '[attr.id]': 'attrId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  attrId = createId();
}
