import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CommentsBranchComponent } from '../../components/comments-branch/comments-branch.component';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'ngd-comments-page',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

    // External Imports
    InfiniteScrollDirective,

    // Internal Imports
    LoadingStubComponent,
    CommentsBranchComponent,
  ],
  templateUrl: './comments-page.component.html',
  styleUrl: './comments-page.component.scss',
})
export class CommentsPageComponent implements OnInit {
  @Input({ required: true })
  postId = '';

  comments$ = of<Comment[]>([]);

  isLoading$ = this._commentsService.connectLoading();

  constructor(private _commentsService: CommentsService) {}

  ngOnInit(): void {
    this.comments$ = this._commentsService.connectPostComments(this.postId);

    this._commentsService.startLoadingPostComments(this.postId);
  }

  handleScroll(): void {
    this._commentsService.startLoadingMorePostComments(this.postId);
  }
}
