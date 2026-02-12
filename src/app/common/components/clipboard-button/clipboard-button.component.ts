import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
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
    '[disabled]': 'disabled()',
    '(click)': 'handleClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClipboardButtonComponent {
  private _destroyRef = inject(DestroyRef);

  private _clipboard = inject(CLIPBOARD);

  private _copied = signal(false);

  copyText = input('Поделиться');

  copiedText = input('Скопировано ✨');

  content = input.required<string>();

  disabled = computed(() => {
    return this._copied();
  });

  text = computed(() => {
    return this._copied() ? this.copiedText() : this.copyText();
  });

  handleClick(): void {
    of(null)
      .pipe(
        tap(() => {
          this._copied.set(true);
        }),
        exhaustMap(() => {
          return from(this._clipboard.writeText(this.content()));
        }),
        delay(1200),
        tap(() => {
          this._copied.set(false);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
