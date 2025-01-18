import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { RandomPostsService } from '../../services/random-posts.service';
import { ScrollService } from '../../../../common/services/scroll.service';

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
    private _scrollService: ScrollService,
    private _randomPostsService: RandomPostsService,
  ) {
    this._scrollService.scroll$.pipe(takeUntilDestroyed()).subscribe(() => {
      this._randomPostsService.startLoadMore();
    });
  }

  ngOnInit(): void {
    this._randomPostsService.startLoading();
  }
}
