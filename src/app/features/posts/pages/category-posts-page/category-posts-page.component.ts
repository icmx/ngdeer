import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, exhaustMap, map } from 'rxjs';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { extractParam } from '../../../../common/mappers/extract-param.mapper';
import { extractScrollPosition } from '../../../../common/mappers/extract-scroll-position.mapper';
import { ScrollPosition } from '../../../../common/types/scroll-position.type';
import { WithFrom } from '../../../../common/types/with-from.type';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'ngd-category-posts-page',
  standalone: true,
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    PostCardComponent,
    LoadingStubComponent,
  ],
  templateUrl: './category-posts-page.component.html',
  styleUrl: './category-posts-page.component.scss',
})
export class CategoryPostsPageComponent {
  private _categoryId$ = this._activatedRoute.params.pipe(
    extractParam<string>('categoryId'),
  );

  private _scrollPosition$ = this._router.events.pipe(extractScrollPosition());

  private _prevScrollPosition: ScrollPosition = null;

  private _from$ = new BehaviorSubject<WithFrom>({});

  private _lastFrom: WithFrom = {};

  private _loadingParams$ = combineLatest([this._categoryId$, this._from$]);

  isLoading$ = this._uiService.isLoading$;

  posts$ = combineLatest([
    this._scrollPosition$,
    this._loadingParams$.pipe(
      exhaustMap(([categoryId, params]) =>
        this._dataService.loadCategoryPosts(categoryId, params),
      ),
    ),
  ]).pipe(
    map(([scrollPosition, posts]) => {
      this._prevScrollPosition = scrollPosition;

      const from = posts.at(-1)?.id;
      this._lastFrom = { from };

      return posts;
    }),
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
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
    this._from$.next(this._lastFrom);
  }
}
