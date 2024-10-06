import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsUiService {
  private _isLoading$ = new BehaviorSubject(false);

  private _branchLoading$ = new BehaviorSubject<null | string>(null);

  isLoading$ = this._isLoading$.asObservable();

  branchLoading$ = this._branchLoading$.asObservable();

  startLoading() {
    this._isLoading$.next(true);
  }

  stopLoading() {
    this._isLoading$.next(false);
  }

  startBranchLoading(rootCommentId: string) {
    this._branchLoading$.next(rootCommentId);
  }

  stopBranchLoading() {
    this._branchLoading$.next(null);
  }
}
