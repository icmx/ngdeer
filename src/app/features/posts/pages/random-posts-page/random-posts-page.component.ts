import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { RandomPostsService } from '../../services/random-posts.service';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';

@Component({
  selector: 'ngd-random-posts-page',
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './random-posts-page.component.html',
  styleUrl: './random-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomPostsPageComponent implements OnInit {
  isLoading$ = this._randomPostsService.selectLoading();

  posts$ = this._randomPostsService.selectEntries();

  constructor(
    private _destroyRef: DestroyRef,
    private _windowScrollService: WindowScrollService,
    private _randomPostsService: RandomPostsService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._randomPostsService.startLoadMore();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._randomPostsService.startLoading();
  }
}
