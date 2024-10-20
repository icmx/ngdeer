import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { RandomPostsService } from '../../services/random-posts.service';

@Component({
  selector: 'ngd-random-posts-page',
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
  templateUrl: './random-posts-page.component.html',
  styleUrl: './random-posts-page.component.scss',
})
export class RandomPostsPageComponent implements OnInit {
  isLoading$ = this._randomPostsService.selectLoading();

  posts$ = this._randomPostsService.selectEntries();

  constructor(private _randomPostsService: RandomPostsService) {}

  ngOnInit(): void {
    this._randomPostsService.startLoading();
  }

  handleScrolled(): void {
    this._randomPostsService.startLoadMore();
  }
}
