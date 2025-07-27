import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  imports: [],
  selector: 'label[ngdCaption]',
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptionComponent {
  @HostBinding('attr.for')
  attrFor: null | string = null;
}
