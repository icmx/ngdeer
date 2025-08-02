import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogRef } from '../../classes/dialog-ref.class';

/**
 * @todo Add 'appearance' option to configure shell appearance (toast or window e.g.)
 */
@Component({
  imports: [],
  selector: 'dialog[ngd-dialog]',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  host: {
    '[attr.open]': 'attrOpen',
    '(document:click)': 'handleClick($event)',
    '(document:keydown.escape)': 'handleEscapeKeydown()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent<TComponent, TResult> {
  private _elementRef = inject<ElementRef<HTMLDialogElement>>(ElementRef);

  private _dialogRef = inject<DialogRef<TComponent, TResult>>(DialogRef);

  @ViewChild('dialogContent', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  attrOpen = 'open';

  handleEscapeKeydown(): void {
    this._dialogRef.close(null);
  }

  handleClick($event: MouseEvent): void {
    const target = $event.target instanceof Node ? $event.target : null;
    const contains = this._elementRef.nativeElement.contains(target);
    const isBackdropClicked = !contains;

    if (isBackdropClicked) {
      this._dialogRef.close(null);
    }
  }
}
