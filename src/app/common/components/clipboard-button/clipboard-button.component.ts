import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, exhaustMap, from, of, tap } from 'rxjs';
import { CLIPBOARD } from '../../providers/clipboard.provider';

@Component({
  selector: 'button[ngd-clipboard-button]',
  imports: [],
  templateUrl: './clipboard-button.component.html',
  styleUrl: './clipboard-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClipboardButtonComponent {
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _destroyRef = inject(DestroyRef);

  private _clipboard = inject(CLIPBOARD);

  @Input()
  copyText = 'Поделиться';

  @Input()
  copiedText = 'Скопировано ✨';

  @Input({ required: true })
  content!: string;

  text = this.copyText;

  @HostBinding('disabled')
  disabled = false;

  @HostListener('click')
  handleClick(): void {
    of(null)
      .pipe(
        tap(() => {
          this.text = this.copiedText;
          this.disabled = true;
          this._changeDetectorRef.markForCheck();
        }),
        exhaustMap(() => {
          return from(this._clipboard.writeText(this.content));
        }),
        delay(1200),
        tap(() => {
          this.text = this.copyText;
          this.disabled = false;
          this._changeDetectorRef.markForCheck();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
