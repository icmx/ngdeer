import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { Comment } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'ngd-comments-branch',
  standalone: true,
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    ButtonComponent,
    LoadingStubComponent,
    CommentCardComponent,
  ],
  templateUrl: './comments-branch.component.html',
  styleUrl: './comments-branch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsBranchComponent implements OnInit {
  @Input({ required: true })
  rootComment!: Comment;

  isLoading$: Observable<boolean> = of(false);

  childComments$: Observable<Comment[]> = of([]);

  showLoadMoreButton$: Observable<boolean> = of(false);

  constructor(private _commentsService: CommentsService) {}

  ngOnInit(): void {
    const rootId = this.rootComment.id;

    this.isLoading$ = this._commentsService.selectLoading(rootId);

    this.childComments$ = this._commentsService.selectBranchComments(rootId);

    this.showLoadMoreButton$ =
      this._commentsService.selectCanLoadMoreBranchComments(rootId);
  }

  handleLoadMoreButtonClick(): void {
    const rootId = this.rootComment.id;

    this._commentsService.startLoadingBranchComments(rootId);
  }
}
