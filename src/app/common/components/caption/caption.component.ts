import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'label[ngdCaption]',
  standalone: true,
  imports: [],
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
})
export class CaptionComponent {
  @HostBinding('attr.for')
  attrFor: null | string = null;
}
