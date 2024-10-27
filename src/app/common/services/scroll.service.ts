import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private _scroll$ = new Subject<void>();

  scroll$ = this._scroll$.asObservable();

  scroll(): void {
    this._scroll$.next();
  }
}
