import { BehaviorSubject } from 'rxjs';

export class DeferredSubject<T> extends BehaviorSubject<T> {
  private _prev: T;

  constructor(prev: T) {
    super(prev);

    this._prev = prev;
  }

  prev(prev: T): void {
    this._prev = prev;
  }

  override getValue(): T {
    return this._prev;
  }

  override next(): void {
    super.next(this._prev);
  }
}
