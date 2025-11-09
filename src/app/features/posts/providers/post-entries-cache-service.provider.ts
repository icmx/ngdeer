import { InjectionToken, Provider } from '@angular/core';
import { EntriesCacheService } from '../../../common/services/entries-cache.serivce';
import { Post } from '../models/post.model';

export const POST_ENTRIES_CACHE_SERVICE = new InjectionToken<
  EntriesCacheService<Post>
>('POST_ENTRIES_CACHE_SERVICE');

export const providePostEntriesCacheService = (): Provider => {
  return {
    provide: POST_ENTRIES_CACHE_SERVICE,
    useFactory: (): EntriesCacheService<Post> => {
      return new EntriesCacheService<Post>();
    },
  };
};
