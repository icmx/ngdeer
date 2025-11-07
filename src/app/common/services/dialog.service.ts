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

export type DialogConfig = {
  appearance: 'modal' | 'toast';
};

export type DialogOpenOptions<TData> = {
  config?: Partial<DialogConfig>;
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

    const config: DialogConfig = {
      appearance: 'modal',
      ...(options?.config || {}),
    };

    const injector = Injector.create({
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_CONFIG, useValue: config },
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
