import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { LatestPostsService } from '../../services/latest-posts.service';
import { ScrollService } from '../../../../common/services/scroll.service';

@Component({
  selector: 'ngd-latest-posts-page',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './latest-posts-page.component.html',
  styleUrl: './latest-posts-page.component.scss',
})
export class LatestPostsPageComponent implements OnInit {
  isLoading$ = this._latestPostsService.selectLoading();

  posts$ = this._latestPostsService.selectEntries();

  constructor(
    private _scrollService: ScrollService,
    private _latestPostsService: LatestPostsService,
  ) {
    this._scrollService.scroll$.pipe(takeUntilDestroyed()).subscribe(() => {
      this._latestPostsService.startLoadingMore();
    });
  }

  ngOnInit(): void {
    this._latestPostsService.startLoading();
  }
}
