import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'label[ngdCaption]',
  imports: [],
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptionComponent {
  @HostBinding('attr.for')
  attrFor: null | string = null;
}
