import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'label[ngdCaption]',
  templateUrl: './caption.component.html',
  styleUrl: './caption.component.scss',
  host: {
    '[attr.for]': 'attrFor',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptionComponent {
  attrFor: string | null = null;
}
