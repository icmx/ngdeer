import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CommentsStateService } from '../../services/comments-state.service';
import { Comment } from '../../models/comment.model';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  imports: [
    // Internal Imports
    ButtonComponent,
    LoadingStubComponent,
    CommentCardComponent,
  ],
  selector: 'ngd-comments-branch',
  templateUrl: './comments-branch.component.html',
  styleUrl: './comments-branch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsBranchComponent {
  private _commentsStateService = inject(CommentsStateService);

  rootComment = input.required<Comment>();

  childComments = computed(() => {
    const rootCommentId = this.rootComment().id;

    return this._commentsStateService
      .state()
      .entries.filter((entry) => entry.rootId === rootCommentId);
  });

  loadingSignal = computed(() => {
    return this._commentsStateService.state().loading[this.rootComment().id];
  });

  shouldShowLoadMoreButtonSignal = computed(() => {
    const rootCommentId = this.rootComment().id;
    const { loading, done } = this._commentsStateService.state();

    if (loading[rootCommentId]) {
      return false;
    }

    if (done[rootCommentId]) {
      return false;
    }

    return true;
  });

  handleLoadMoreButtonClick(): void {
    const rootCommentId = this.rootComment().id;

    this._commentsStateService.loadCommentsBranchByRootCommentId(rootCommentId);
  }
}
