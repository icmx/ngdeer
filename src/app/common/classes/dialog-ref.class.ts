import { Observable, Subject } from 'rxjs';

export class DialogRef<TComponent, TResult> {
  private _afterClosed$ = new Subject<TResult | null>();

  component: TComponent | null = null;

  afterClosed(): Observable<TResult | null> {
    return this._afterClosed$.asObservable();
  }

  close(result: TResult | null): void {
    this._afterClosed$.next(result);
    this._afterClosed$.complete();
  }
}
