import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogRef } from '../../classes/dialog-ref.class';
import { DIALOG_CONFIG } from '../../services/dialog.service';

@Component({
  imports: [],
  selector: 'dialog[ngd-dialog]',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  host: {
    '[open]': '"open"',
    '[class]': 'className',
    '(click)': 'handleClick($event)',
    '(document:keydown.escape)': 'handleDocumentEscapeKeydown()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent<TComponent, TResult> {
  private _elementRef = inject<ElementRef<HTMLDialogElement>>(ElementRef);

  private _dialogRef = inject<DialogRef<TComponent, TResult>>(DialogRef);

  private _dialogConfig = inject(DIALOG_CONFIG);

  @ViewChild('dialogContent', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  get className(): string {
    return `ngd-dialog is-${this._dialogConfig.appearance}`;
  }

  handleClick($event: MouseEvent): void {
    const target = $event.target instanceof Element ? $event.target : null;
    const isSelf = target === this._elementRef.nativeElement;

    if (isSelf) {
      this._dialogRef.close(null);
    }
  }

  handleDocumentEscapeKeydown(): void {
    this._dialogRef.close(null);
  }
}
