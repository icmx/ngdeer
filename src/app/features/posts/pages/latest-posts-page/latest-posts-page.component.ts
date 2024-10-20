import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { LatestPostsService } from '../../services/latest-posts.service';

@Component({
  selector: 'ngd-latest-posts-page',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

    // External Imports
    InfiniteScrollDirective,

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

  constructor(private _latestPostsService: LatestPostsService) {}

  ngOnInit(): void {
    this._latestPostsService.startLoading();
  }

  handleScrolled(): void {
    this._latestPostsService.startLoadingMore();
  }
}
