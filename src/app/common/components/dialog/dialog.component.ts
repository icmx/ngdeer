import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent<TComponent, TResult> {
  private _elementRef = inject(ElementRef);

  private _dialogRef = inject<DialogRef<TComponent, TResult>>(DialogRef);

  @ViewChild('dialogContent', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  @HostBinding('attr.open')
  attrOpen = 'open';

  @HostListener('document:keydown.escape')
  handleEscapeKeydown(): void {
    this._dialogRef.close(null);
  }

  @HostListener('click', ['$event'])
  handleClick($event: MouseEvent): void {
    const isBackdropClicked = $event.target === this._elementRef.nativeElement;

    if (isBackdropClicked) {
      this._dialogRef.close(null);
    }
  }
}
