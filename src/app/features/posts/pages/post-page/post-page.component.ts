import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { CommentsBranchComponent } from '../../../comments/components/comments-branch/comments-branch.component';
import { CommentsStateService } from '../../../comments/services/comments-state.service';
import { CommentsLoading } from '../../../comments/enums/comments-loading.enum';
import { HiddenUsersIdsService } from '../../../users/services/hidden-users-ids.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostStateService } from '../../services/post-state.service';

@Component({
  imports: [
    // Internal Imports
    PostCardComponent,
    CommentsBranchComponent,
    LoadingStubComponent,
  ],
  selector: 'ngd-post-page',
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _postStateService = inject(PostStateService);

  private _commentsStateService = inject(CommentsStateService);

  private _hiddenUsersIdsService = inject(HiddenUsersIdsService);

  postId = input.required<string>();

  post = computed(() => this._postStateService.entry());

  comments = computed(() => {
    const postId = this.postId();
    const userIds = this._hiddenUsersIdsService.ids();

    return this._commentsStateService.entries().filter((entry) => {
      return (
        entry.rootId === null &&
        entry.postId === postId &&
        !userIds.includes(entry.user.id)
      );
    });
  });

  isLoading = computed(() => {
    return (
      this._postStateService.isLoading() ||
      this._commentsStateService.isLoadingBy()[CommentsLoading.Root]
    );
  });

  ngOnInit(): void {
    const postId = this.postId();

    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._commentsStateService.loadMorePostCommentsByPostId(postId);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._postStateService.load(postId);
    this._commentsStateService.loadPostCommentsByPostId(postId);
  }
}
