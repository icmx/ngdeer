import { Component, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { ScrollService } from '../../../../common/services/scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { CategoryPostsService } from '../../services/category-posts.service';

@Component({
  selector: 'ngd-category-posts-page',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

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

  isLoading$ = this._categoryPostsService.selectLoading();

  posts$ = of<Post[]>([]);

  constructor(
    private _scrollService: ScrollService,
    private _categoryPostsService: CategoryPostsService,
  ) {
    this._scrollService.scroll$.pipe(takeUntilDestroyed()).subscribe(() => {
      this._categoryPostsService.startLoadingMore(this.categoryId);
    });
  }

  ngOnInit(): void {
    this.posts$ = this._categoryPostsService.selectEntries(this.categoryId);

    this._categoryPostsService.startLoading(this.categoryId);
  }
}
