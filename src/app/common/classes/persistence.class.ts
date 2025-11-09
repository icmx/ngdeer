import { inject, WritableSignal, Signal, signal } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export type PersistenceOptions<TValue> = {
  key: string;
  initialValue: TValue;
};

export class Persistence<TValue> {
  private _localStorageService = inject(LocalStorageService);

  private _key: string;

  private _value: WritableSignal<TValue>;

  value: Signal<TValue>;

  constructor(options: PersistenceOptions<TValue>) {
    this._key = options.key;

    const initialValue =
      this._localStorageService.getItem<TValue>(this._key) ||
      options.initialValue;

    this._value = signal(initialValue);

    this.value = this._value.asReadonly();
  }

  setValue(value: TValue): void {
    this._value.set(value);

    this._localStorageService.setItem<TValue>(this._key, this._value());
  }

  updateValue(update: (value: TValue) => TValue): void {
    this._value.update(update);

    this._localStorageService.setItem<TValue>(this._key, this._value());
  }
}
