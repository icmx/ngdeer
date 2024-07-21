import { Component, HostBinding } from '@angular/core';
import { createId } from '../../utils/get-id.util';

@Component({
  selector: 'input[ngdControl],select[ngdControl]',
  standalone: true,
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent {
  @HostBinding('attr.id')
  attrId = createId();
}
