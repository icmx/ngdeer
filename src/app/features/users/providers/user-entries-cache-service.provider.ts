import { InjectionToken, Provider } from '@angular/core';
import { EntriesCacheService } from '../../../common/services/entries-cache.serivce';
import { User } from '../models/user.model';

export const USER_ENTRIES_CACHE_SERVICE = new InjectionToken<
  EntriesCacheService<User>
>('USER_ENTRIES_CACHE_SERVICE');

export const provideUserEntriesCacheService = (): Provider => {
  return {
    provide: USER_ENTRIES_CACHE_SERVICE,
    useFactory: (): EntriesCacheService<User> => {
      return new EntriesCacheService<User>();
    },
  };
};
