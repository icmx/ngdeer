import { AsyncPipe, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, exhaustMap, map, startWith } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { extractScrollPosition } from '../../../../common/mappers/extract-scroll-position.mapper';
import { ScrollPosition } from '../../../../common/types/scroll-position.type';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

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
export class RandomPostsPageComponent {
  private _scrollPosition$ = this._router.events.pipe(extractScrollPosition());

  private _prevScrollPosition: ScrollPosition = null;

  private _scroll$ = new Subject<void>();

  isLoading$ = this._uiService.isLoading$;

  posts$ = combineLatest([
    this._scrollPosition$,
    this._scroll$.pipe(
      startWith(undefined),
      exhaustMap(() => this._dataService.loadRandomPosts()),
    ),
  ]).pipe(
    map(([scrollPosition, posts]) => {
      this._prevScrollPosition = scrollPosition;

      return posts;
    }),
  );

  constructor(
    private _router: Router,
    private _viewportScroller: ViewportScroller,
    private _dataService: DataService,
    private _uiService: UiService,
  ) {}

  ngAfterViewChecked(): void {
    if (this._prevScrollPosition) {
      this._viewportScroller.scrollToPosition(this._prevScrollPosition);
    }
  }

  handleScrolled(): void {
    this._scroll$.next();
  }
}
