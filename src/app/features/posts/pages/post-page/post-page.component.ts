import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, of } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CommentsBranchComponent } from '../../../comments/components/comments-branch/comments-branch.component';
import { ScrollService } from '../../../../common/services/scroll.service';
import { Comment } from '../../../comments/models/comment.model';
import { CommentsService } from '../../../comments/services/comments.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'ngd-post-page',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    PostCardComponent,
    CommentsBranchComponent,
    LoadingStubComponent,
  ],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPageComponent implements OnInit {
  @Input()
  postId = '';

  isLoading$ = combineLatest([
    this._postService.selectLoading(),
    this._commentsService.selectLoading(),
  ]).pipe(
    map((loadings) => {
      return loadings.some((loading) => loading === true);
    }),
  );

  post$ = of<Post | null>(null);

  comments$ = of<Comment[]>([]);

  constructor(
    private _scrollService: ScrollService,
    private _postService: PostService,
    private _commentsService: CommentsService,
  ) {
    this._scrollService.scroll$.pipe(takeUntilDestroyed()).subscribe(() => {
      this._commentsService.startLoadingMorePostComments(this.postId);
    });
  }

  ngOnInit(): void {
    this.post$ = this._postService.selectEntry();
    this._postService.startLoading(this.postId);

    this.comments$ = this._commentsService.selectPostComments(this.postId);
    this._commentsService.startLoadingPostComments(this.postId);
  }
}
