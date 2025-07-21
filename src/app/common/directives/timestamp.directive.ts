import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { toAbsoluteDateString } from '../utils/to-absolute-date-string.util';
import { toRelativeDateString } from '../utils/to-relative-date-string.util';
import { DateInit } from '../types/date-init.type';

@Directive({
  selector: 'time[timestamp]',
  standalone: true,
})
export class TimestampDirective implements AfterViewInit {
  private _elementRef = inject<ElementRef<HTMLTimeElement>>(ElementRef);

  @Input({ required: true })
  timestamp!: DateInit;

  @HostBinding('attr.datetime')
  get attrDatetime(): string {
    const attrDatetime = toAbsoluteDateString(this.timestamp);

    return attrDatetime;
  }

  ngAfterViewInit(): void {
    const innerText = toRelativeDateString(this.timestamp);

    this._elementRef.nativeElement.innerText = innerText;
  }
}
