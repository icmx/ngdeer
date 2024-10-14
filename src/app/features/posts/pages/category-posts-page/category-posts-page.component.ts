import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { CategoryPostsService } from '../../services/category-posts.service';
import { of } from 'rxjs';

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

  isLoading$ = this._categoryPostsService.connectLoading();

  posts$ = of<Post[]>([]);

  constructor(private _categoryPostsService: CategoryPostsService) {}

  ngOnInit(): void {
    this.posts$ = this._categoryPostsService.connectEntries(this.categoryId);

    this._categoryPostsService.startLoading(this.categoryId);
  }

  handleScrolled(): void {
    this._categoryPostsService.startLoadingMore(this.categoryId);
  }
}
