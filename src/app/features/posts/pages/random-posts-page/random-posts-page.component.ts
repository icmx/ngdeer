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
  imports: [
    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  selector: 'ngd-random-posts-page',
  templateUrl: './random-posts-page.component.html',
  styleUrl: './random-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _randomPostsStateService = inject(RandomPostsStateService);

  posts = computed(() => this._randomPostsStateService.state().entries);

  loading = computed(() => this._randomPostsStateService.state().loading);

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._randomPostsStateService.loadMore();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._randomPostsStateService.load();
  }
}
