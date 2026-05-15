import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ErrorStubComponent } from '../../../../common/components/error-stub/error-stub.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { LatestPostsStateService } from '../../services/latest-posts-state.service';

@Component({
  imports: [
    // Internal Imports
    ErrorStubComponent,
    LoadingStubComponent,
    PostCardComponent,
  ],
  selector: 'ngd-latest-posts-page',
  templateUrl: './latest-posts-page.component.html',
  styleUrl: './latest-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _latestPostsStateService = inject(LatestPostsStateService);

  isLoading = this._latestPostsStateService.isLoading;

  error = this._latestPostsStateService.error;

  posts = this._latestPostsStateService.entries;

  ngOnInit(): void {
    this._setupScrollToBottom();

    this._latestPostsStateService.load();
  }

  private _setupScrollToBottom(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._latestPostsStateService.loadMore();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
