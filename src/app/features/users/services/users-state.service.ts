import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { UsersApiService } from './users-api.service';
import { User } from '../models/user.model';
import { concatMap, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USER_ENTRIES_CACHE_SERVICE } from '../providers/user-entries-cache-service.provider';
import { extractUserFromReply } from '../operators/extract-user-from-reply.operator';

@Injectable()
export class UsersStateService {
  private _destroyRef = inject(DestroyRef);

  private _usersApiService = inject(UsersApiService);

  private _userEntriesCacheService = inject(USER_ENTRIES_CACHE_SERVICE);

  private _entries = signal<User[]>([]);

  entries = this._entries.asReadonly();

  load(id: string): void {
    of(null)
      .pipe(
        concatMap(() => {
          const cachedEntry = this._userEntriesCacheService.get(id);

          if (cachedEntry) {
            return of(cachedEntry);
          }

          return this._usersApiService.getProfileByUserId(id).pipe(
            extractUserFromReply(),
            tap((entry) => {
              this._userEntriesCacheService.add(entry);
            }),
          );
        }),
        tap((entry) => {
          this._entries.update((entries) => [...entries, entry]);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
