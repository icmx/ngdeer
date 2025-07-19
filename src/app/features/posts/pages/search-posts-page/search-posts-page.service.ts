import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, of, Subscription, tap } from 'rxjs';
import { WithCategoryId } from '../../../../common/types/with-category-id.type';
import { WithText } from '../../../../common/types/with-text.type';
import { Post } from '../../models/post.model';
import { extractPostsFromReply } from '../../operators/extract-posts-from-reply.operator';
import {
  GetPostsRequestOptions,
  PostsApiService,
} from '../../services/posts-api.service';
import { PostsCacheService } from '../../services/posts-cache.service';

export type SearchPostsPageState = {
  loading: boolean;
  entries: Post[];
};

@Injectable()
export class SearchPostsPageService {
  private _destroyRef = inject(DestroyRef);

  private _postsApiService = inject(PostsApiService);

  private _postsCacheService = inject(PostsCacheService);

  private _state = signal<SearchPostsPageState>({
    loading: false,
    entries: [],
  });

  private _from = computed(() => {
    return this._state().entries.at(-1)?.id;
  });

  private _subscriptionRef?: Subscription;

  state = this._state.asReadonly();

  load(params: WithText & WithCategoryId): void {
    if (!this._subscriptionRef?.closed) {
      return;
    }

    this._subscriptionRef = of(null)
      .pipe(
        tap(() => {
          this._state.update((state) => ({ ...state, loading: true }));
        }),
        concatMap(() => {
          const options: GetPostsRequestOptions = {
            params: {},
          };

          const from = this._from();

          if (from) {
            options.params = { ...options.params, from: from };
          }

          if (params.text) {
            options.params = {
              ...options.params,
              search_criteria: params.text,
            };
          }

          if (params.categoryId) {
            options.params = {
              ...options.params,
              category_id: params.categoryId,
            };
          }

          return this._postsApiService.getPosts(options);
        }),
        extractPostsFromReply(),
        tap((entries) => {
          this._postsCacheService.add(...entries);

          this._state.update((state) => ({
            loading: false,
            entries: [...state.entries, ...entries],
          }));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  drop(): void {
    this._state.set({ loading: false, entries: [] });
  }
}
