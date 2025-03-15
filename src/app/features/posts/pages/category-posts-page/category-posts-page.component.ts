import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { of, tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { CategoryPostsService } from '../../services/category-posts.service';

@Component({
  selector: 'ngd-category-posts-page',
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './category-posts-page.component.html',
  styleUrl: './category-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPostsPageComponent implements OnInit {
  @Input({ required: true })
  categoryId = '';

  isLoading$ = this._categoryPostsService.selectLoading();

  posts$ = of<Post[]>([]);

  constructor(
    private _destroyRef: DestroyRef,
    private _windowScrollService: WindowScrollService,
    private _categoryPostsService: CategoryPostsService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._categoryPostsService.startLoadingMore(this.categoryId);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this.posts$ = this._categoryPostsService.selectEntries(this.categoryId);

    this._categoryPostsService.startLoading(this.categoryId);
  }
}
