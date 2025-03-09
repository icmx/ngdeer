import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { LatestPostsService } from '../../services/latest-posts.service';

@Component({
  selector: 'ngd-latest-posts-page',
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './latest-posts-page.component.html',
  styleUrl: './latest-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPostsPageComponent implements OnInit {
  isLoading$ = this._latestPostsService.selectLoading();

  posts$ = this._latestPostsService.selectEntries();

  constructor(
    private _windowScrollService: WindowScrollService,
    private _latestPostsService: LatestPostsService,
  ) {
    this._windowScrollService.scrollToBottom$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this._latestPostsService.startLoadingMore();
      });
  }

  ngOnInit(): void {
    this._latestPostsService.startLoading();
  }
}
