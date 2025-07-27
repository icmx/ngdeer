import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogRef } from '../../classes/dialog-ref.class';

@Component({
  imports: [],
  selector: 'dialog[ngd-dialog]',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  host: {
    '[attr.open]': 'attrOpen',
    '(document:keydown.escape)': 'handleEscapeKeydown()',
    '(click)': 'handleClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent<TComponent, TResult> {
  private _elementRef = inject(ElementRef);

  private _dialogRef = inject<DialogRef<TComponent, TResult>>(DialogRef);

  @ViewChild('dialogContent', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  attrOpen = 'open';

  handleEscapeKeydown(): void {
    this._dialogRef.close(null);
  }

  handleClick($event: MouseEvent): void {
    const isBackdropClicked = $event.target === this._elementRef.nativeElement;

    if (isBackdropClicked) {
      this._dialogRef.close(null);
    }
  }
}
