import {
  ApplicationRef,
  createComponent,
  DestroyRef,
  DOCUMENT,
  EmbeddedViewRef,
  EnvironmentInjector,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogRef } from '../classes/dialog-ref.class';
import { DialogComponent } from '../components/dialog/dialog.component';

/**
 * @todo: This will be implemented later when alert will be introduced
 */
export type DialogConfig = {};

export type DialogOpenOptions<TData> = {
  config?: DialogConfig;
  data?: TData;
};

export const DIALOG_CONFIG = new InjectionToken<DialogConfig>('DIALOG_CONFIG');

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private _document = inject(DOCUMENT);

  private _applicationRef = inject(ApplicationRef);

  private _destroyRef = inject(DestroyRef);

  private _injector = inject(EnvironmentInjector);

  open<TComponent, TData, TResult>(
    component: Type<TComponent>,
    options?: DialogOpenOptions<TData>,
  ): DialogRef<TComponent, TResult> {
    const dialogRef = new DialogRef<TComponent, TResult>();

    const injector = Injector.create({
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_CONFIG, useValue: options?.config },
        { provide: DIALOG_DATA, useValue: options?.data },
      ],
    });

    const container = createComponent(DialogComponent, {
      environmentInjector: this._injector,
      elementInjector: injector,
    });

    this._applicationRef.attachView(container.hostView);

    const node = (
      container.hostView as EmbeddedViewRef<
        DialogComponent<TComponent, TResult>
      >
    ).rootNodes.at(0);

    this._document.body.appendChild(node);

    const content = container.instance.viewContainerRef.createComponent(
      component,
      {
        injector,
      },
    );

    dialogRef.component = content.instance;

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._applicationRef.detachView(container.hostView);

        content.destroy();
        container.destroy();
      });

    return dialogRef;
  }
}
