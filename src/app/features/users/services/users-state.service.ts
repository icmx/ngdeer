import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  concatMap,
  defer,
  EMPTY,
  finalize,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { User } from '../models/user.model';
import { extractUserFromReply } from '../operators/extract-user-from-reply.operator';
import { USER_ENTRIES_CACHE_SERVICE } from '../providers/user-entries-cache-service.provider';
import {
  GetProfileByUserIdRequest,
  UsersApiService,
} from './users-api.service';

@Injectable()
export class UsersStateService {
  private _destroyRef = inject(DestroyRef);

  private _usersApiService = inject(UsersApiService);

  private _userEntriesCacheService = inject(USER_ENTRIES_CACHE_SERVICE);

  private _load$ = new Subject<GetProfileByUserIdRequest>();

  private _isLoading = signal(false);

  private _error = signal<string | null>(null);

  private _entries = signal<User[]>([]);

  isLoading = this._isLoading.asReadonly();

  error = this._error.asReadonly();

  entries = this._entries.asReadonly();

  constructor() {
    this._setupLoad();
  }

  load(userId: string): void {
    this._load$.next({ path: { userId } });
  }

  private _getEntry(request: GetProfileByUserIdRequest): Observable<User> {
    return defer(() => {
      this._error.set(null);

      const cached = this._userEntriesCacheService.get(request.path.userId);

      if (cached) {
        return of(cached);
      }

      this._isLoading.set(true);

      return this._usersApiService.getProfileByUserId(request).pipe(
        extractUserFromReply(),
        tap((entry) => {
          this._userEntriesCacheService.set(entry);
        }),
      );
    }).pipe(
      tap((entry) => {
        this._entries.update((entries) => [...entries, entry]);
      }),
      catchError((error) => {
        this._error.set(error?.message || 'Failed while fetching posts');

        return EMPTY;
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  private _setupLoad(): void {
    this._load$
      .pipe(
        concatMap((request) => {
          return this._getEntry(request);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
