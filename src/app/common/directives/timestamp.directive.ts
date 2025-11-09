import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { toAbsoluteDateString } from '../utils/to-absolute-date-string.util';
import { toRelativeDateString } from '../utils/to-relative-date-string.util';
import { DateInit } from '../types/date-init.type';

@Directive({
  standalone: true,
  selector: 'time[timestamp]',
  host: {
    '[attr.datetime]': 'attrDatetime',
    '[attr.title]': 'attrTitle',
  },
})
export class TimestampDirective {
  private _elementRef = inject<ElementRef<HTMLTimeElement>>(ElementRef);

  timestamp = input.required<DateInit>();

  attrDatetime: string | undefined = undefined;

  attrTitle: string | undefined = undefined;

  constructor() {
    effect(() => {
      const timestamp = this.timestamp();

      const absolute = toAbsoluteDateString(timestamp);
      const relative = toRelativeDateString(timestamp);

      this.attrDatetime = absolute;
      this.attrTitle = absolute;

      this._elementRef.nativeElement.innerText = relative;
    });
  }
}
