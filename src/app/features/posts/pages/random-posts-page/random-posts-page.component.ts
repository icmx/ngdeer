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
import { RandomPostsStateService } from '../../services/random-posts-state.service';

@Component({
  selector: 'ngd-random-posts-page',
  imports: [
    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './random-posts-page.component.html',
  styleUrl: './random-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomPostsPageComponent implements OnInit {
  private _randomPostsStateService = inject(RandomPostsStateService);

  postsSignal = computed(() => this._randomPostsStateService.state().entries);

  loadingSignal = computed(() => this._randomPostsStateService.state().loading);

  constructor(
    private _destroyRef: DestroyRef,
    private _windowScrollService: WindowScrollService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._randomPostsStateService.load();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._randomPostsStateService.load();
  }
}
