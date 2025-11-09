import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, exhaustMap, from, of, tap } from 'rxjs';
import { CLIPBOARD } from '../../providers/clipboard.provider';

@Component({
  imports: [],
  selector: 'button[ngd-clipboard-button]',
  templateUrl: './clipboard-button.component.html',
  styleUrl: './clipboard-button.component.scss',
  host: {
    '[disabled]': 'disabled',
    '(click)': 'handleClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClipboardButtonComponent {
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _destroyRef = inject(DestroyRef);

  private _clipboard = inject(CLIPBOARD);

  copyText = input('Поделиться');

  copiedText = input('Скопировано ✨');

  content = input.required<string>();

  text = this.copyText();

  disabled: 'disabled' | false = false;

  handleClick(): void {
    of(null)
      .pipe(
        tap(() => {
          this.text = this.copiedText();
          this.disabled = 'disabled';
          this._changeDetectorRef.markForCheck();
        }),
        exhaustMap(() => {
          return from(this._clipboard.writeText(this.content()));
        }),
        delay(1200),
        tap(() => {
          this.text = this.copyText();
          this.disabled = false;
          this._changeDetectorRef.markForCheck();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
