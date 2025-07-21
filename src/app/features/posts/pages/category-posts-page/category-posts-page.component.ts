import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CategoryPostsStateService } from '../../services/category-posts-state.service';

@Component({
  selector: 'ngd-category-posts-page',
  imports: [
    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './category-posts-page.component.html',
  styleUrl: './category-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _categoryPostsStateService = inject(CategoryPostsStateService);

  categoryId = input.required<string>();

  postsSignal = computed(() => this._categoryPostsStateService.state().entries);

  loadingSignal = computed(
    () => this._categoryPostsStateService.state().loading,
  );

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._categoryPostsStateService.load(this.categoryId());
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._categoryPostsStateService.load(this.categoryId());
  }
}
