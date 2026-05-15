import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ErrorStubComponent } from '../../../../common/components/error-stub/error-stub.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CategoryPostsStateService } from '../../services/category-posts-state.service';

@Component({
  imports: [
    // Internal Imports
    ErrorStubComponent,
    LoadingStubComponent,
    PostCardComponent,
  ],
  selector: 'ngd-category-posts-page',
  templateUrl: './category-posts-page.component.html',
  styleUrl: './category-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _categoryPostsStateService = inject(CategoryPostsStateService);

  categoryId = input.required<string>();

  isLoading = this._categoryPostsStateService.isLoading;

  error = this._categoryPostsStateService.error;

  posts = this._categoryPostsStateService.entries;

  ngOnInit(): void {
    this._setupScrollToBottom();

    this._categoryPostsStateService.load({ categoryId: this.categoryId() });
  }

  private _setupScrollToBottom(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._categoryPostsStateService.loadMore({
            categoryId: this.categoryId(),
          });
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
