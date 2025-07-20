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
  selector: 'ngd-comments-branch',
  imports: [
    // Internal Imports
    ButtonComponent,
    LoadingStubComponent,
    CommentCardComponent,
  ],
  templateUrl: './comments-branch.component.html',
  styleUrl: './comments-branch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsBranchComponent {
  private _commentsStateService = inject(CommentsStateService);

  rootComment = input.required<Comment>();

  childComments = computed(() => {
    return this._commentsStateService
      .state()
      .entries.filter((entry) => entry.rootId === this.rootComment().id);
  });

  loadingSignal = computed(() => {
    return this._commentsStateService.state().loading === this.rootComment().id;
  });

  shouldShowLoadMoreButtonSignal = computed(() => {
    const rootCommentId = this.rootComment().id;
    const { loading, entries } = this._commentsStateService.state();

    if (loading === rootCommentId) {
      return false;
    }

    const root = entries.find((entry) => entry.id === rootCommentId);

    if (!root) {
      return false;
    }

    const { length } = entries.filter(
      (entry) => entry.rootId === rootCommentId,
    );

    if (length === 0) {
      return false;
    }

    const { branchSize } = root;

    if (branchSize !== null && branchSize > 0 && branchSize !== length) {
      return true;
    }

    const PAGE_SIZE = 30;

    return length % PAGE_SIZE === 0;
  });

  handleLoadMoreButtonClick(): void {
    const rootCommentId = this.rootComment().id;

    this._commentsStateService.loadBranch(rootCommentId);
  }
}
