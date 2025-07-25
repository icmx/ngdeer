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
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostStateService } from '../../services/post-state.service';
import { CommentsStateService } from '../../../comments/services/comments-state.service';
import { CommentsLoading } from '../../../comments/enums/comments-loading.enum';

@Component({
  selector: 'ngd-post-page',
  imports: [
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
  private _destroyRef = inject(DestroyRef);

  private _windowScrollService = inject(WindowScrollService);

  private _postStateService = inject(PostStateService);

  private _commentsStateService = inject(CommentsStateService);

  postId = input.required<string>();

  postSignal = computed(() => this._postStateService.state().entry);

  commentsSignal = computed(() => {
    const postId = this.postId();

    return this._commentsStateService
      .state()
      .entries.filter(
        (entry) => entry.rootId === null && entry.postId === postId,
      );
  });

  loadingSignal = computed(() => {
    return (
      this._postStateService.state().loading ||
      this._commentsStateService.state().loading[CommentsLoading.Root]
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
