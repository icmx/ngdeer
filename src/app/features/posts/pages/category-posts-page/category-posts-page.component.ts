import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, exhaustMap, map, of } from 'rxjs';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { DeferredSubject } from '../../../../common/classes/deferred-subject.class';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { extractParam } from '../../../../common/mappers/extract-param.mapper';
import { extractScrollPosition } from '../../../../common/mappers/extract-scroll-position.mapper';
import { ScrollPosition } from '../../../../common/types/scroll-position.type';
import { WithFrom } from '../../../../common/types/with-from.type';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostsDataService } from '../../services/posts-data.service';
import { PostsUiService } from '../../services/posts-ui.service';
import { Post } from '../../models/post.model';
import { CategoryPostsService } from '../../services/category-posts.service';

@Component({
  selector: 'ngd-category-posts-page',
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
  templateUrl: './category-posts-page.component.html',
  styleUrl: './category-posts-page.component.scss',
})
export class CategoryPostsPageComponent implements OnInit {
  @Input({ required: true })
  categoryId = '';
  // private _categoryId$ = this._activatedRoute.params.pipe(
  //   extractParam<string>('categoryId'),
  // );

  // private _scrollPosition$ = this._router.events.pipe(extractScrollPosition());

  // private _prevScrollPosition: ScrollPosition = null;

  // private _from$ = new DeferredSubject<WithFrom>({});

  // private _loadingParams$ = combineLatest([this._categoryId$, this._from$]);

  isLoading$ = of<boolean>(false);

  posts$ = of<Post[]>([]);

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _viewportScroller: ViewportScroller,
    private _postsDataService: PostsDataService,
    private _postsUiService: PostsUiService,
    private _categoryPostsService: CategoryPostsService,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._categoryPostsService.connectLoading();

    this.posts$ = this._categoryPostsService.connectEntries(this.categoryId);

    this._categoryPostsService.startLoading(this.categoryId);

    // const categoryId = this.categoryId

    // this.isLoading$ = this._

    // throw new Error('Method not implemented.');
  }

  // ngAfterViewChecked(): void {
  //   if (this._prevScrollPosition) {
  //     this._viewportScroller.scrollToPosition(this._prevScrollPosition);
  //   }
  // }

  handleScrolled(): void {
    this._categoryPostsService.startLoadingMore(this.categoryId);
    // if (this._from$.getValue()?.from) {
    //   this._from$.next();
    // }
  }
}
