import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnInit,
} from '@angular/core';
import { CaptionComponent } from '../../components/caption/caption.component';
import { ControlComponent } from '../../components/control/control.component';
import { SuffixDirective } from '../../directives/suffix.directive';

@Component({
  selector: 'ngd-field',
  imports: [
    // Internal Imports
    // These are not necessary, but they're closely related
    CaptionComponent,
    ControlComponent,
    SuffixDirective,
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnInit {
  @ContentChild(CaptionComponent, { static: true })
  caption!: CaptionComponent;

  @ContentChild(ControlComponent, { static: true })
  control!: ControlComponent;

  ngOnInit(): void {
    this.caption.attrFor = this.control.attrId;
  }
}
