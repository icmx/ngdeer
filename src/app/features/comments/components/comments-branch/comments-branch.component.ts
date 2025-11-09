import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { HiddenUsersIdsService } from '../../../users/services/hidden-users-ids.service';
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

  private _hiddenUsersIdsService = inject(HiddenUsersIdsService);

  rootComment = input.required<Comment>();

  childComments = computed(() => {
    const rootCommentId = this.rootComment().id;
    const userIds = this._hiddenUsersIdsService.ids();

    return this._commentsStateService.entries().filter((entry) => {
      return entry.rootId === rootCommentId && !userIds.includes(entry.user.id);
    });
  });

  isLoading = computed(() => {
    return this._commentsStateService.isLoadingBy()[this.rootComment().id];
  });

  shouldShowLoadMoreButton = computed(() => {
    const rootCommentId = this.rootComment().id;

    if (this._commentsStateService.isLoadingBy()[rootCommentId]) {
      return false;
    }

    if (this._commentsStateService.isDoneBy()[rootCommentId]) {
      return false;
    }

    return true;
  });

  handleLoadMoreButtonClick(): void {
    const rootCommentId = this.rootComment().id;

    this._commentsStateService.loadCommentsBranchByRootCommentId(rootCommentId);
  }
}
