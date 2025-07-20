import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
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
  private _latestPostsStateService = inject(LatestPostsStateService);

  postsSignal = computed(() => this._latestPostsStateService.state().entries);

  loadingSignal = computed(() => this._latestPostsStateService.state().loading);

  constructor(
    private _destroyRef: DestroyRef,
    private _windowScrollService: WindowScrollService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._latestPostsStateService.load();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._latestPostsStateService.load();
  }
}
