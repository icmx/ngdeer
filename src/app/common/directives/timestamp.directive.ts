import {
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { toAbsoluteDateString } from '../utils/to-absolute-date-string.util';
import { toRelativeDateString } from '../utils/to-relative-date-string.util';
import { DateInit } from '../types/date-init.type';

@Directive({
  selector: 'time[timestamp]',
  standalone: true,
})
export class TimestampDirective {
  private _elementRef = inject<ElementRef<HTMLTimeElement>>(ElementRef);

  timestamp = input.required<DateInit>();

  @HostBinding('attr.datetime')
  attrDatetime: string | undefined = undefined;

  @HostBinding('attr.title')
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
