import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { LatestPostsStateService } from '../../services/latest-posts-state.service';

@Component({
  selector: 'ngd-latest-posts-page',
  imports: [
    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './latest-posts-page.component.html',
  styleUrl: './latest-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _latestPostsStateService = inject(LatestPostsStateService);

  private _runFirstLoadSignal = computed(
    () => this._latestPostsStateService.state().entries.length === 0,
  );

  private _runNextLoadsSignal = computed(
    () => !this._latestPostsStateService.state().loading,
  );

  postsSignal = computed(() => this._latestPostsStateService.state().entries);

  loadingSignal = computed(() => this._latestPostsStateService.state().loading);

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        filter(() => {
          return this._runNextLoadsSignal();
        }),
        tap(() => {
          this._latestPostsStateService.load();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    if (this._runFirstLoadSignal()) {
      this._latestPostsStateService.load();
    }
  }
}
