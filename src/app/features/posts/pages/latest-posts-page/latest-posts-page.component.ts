import { AfterViewChecked, Component } from '@angular/core';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, exhaustMap, map } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { extractScrollPosition } from '../../../../common/mappers/extract-scroll-position.mapper';
import { ScrollPosition } from '../../../../common/types/scroll-position.type';
import { WithFrom } from '../../../../common/types/with-from.type';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'ngd-latest-posts-page',
  standalone: true,
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    PostCardComponent,
    LoadingStubComponent,
  ],
  templateUrl: './latest-posts-page.component.html',
  styleUrl: './latest-posts-page.component.scss',
})
export class LatestPostsPageComponent implements AfterViewChecked {
  private _scrollPosition$ = this._router.events.pipe(extractScrollPosition());

  private _prevScrollPosition: ScrollPosition = null;

  private _from$ = new BehaviorSubject<WithFrom>({});

  private _prevFrom: WithFrom = {};

  isLoading$ = this._uiService.isLoading$;

  posts$ = combineLatest([
    this._scrollPosition$,
    this._from$.pipe(
      exhaustMap((params) => this._dataService.loadLatestPosts(params)),
    ),
  ]).pipe(
    map(([scrollPosition, posts]) => {
      this._prevScrollPosition = scrollPosition;

      const from = posts.at(-1)?.id;
      this._prevFrom = { from };

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
    if (this._prevFrom?.from) {
      this._from$.next(this._prevFrom);
    }
  }
}
