import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, of, tap } from 'rxjs';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { CommentsBranchComponent } from '../../../comments/components/comments-branch/comments-branch.component';
import { Comment } from '../../../comments/models/comment.model';
import { CommentsService } from '../../../comments/services/comments.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.model';
import { PostStateService } from '../../services/post-state.service';

@Component({
  selector: 'ngd-post-page',
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
  private _postStateService = inject(PostStateService);

  postId = input.required<string>();

  isLoading$ = combineLatest([
    toObservable(computed(() => this._postStateService.state().loading)),
    this._commentsService.selectLoading(),
  ]).pipe(
    map((loadings) => {
      return loadings.some((loading) => loading === true);
    }),
  );

  post$ = of<Post | undefined>(undefined);

  comments$ = of<Comment[]>([]);

  constructor(
    private _destroyRef: DestroyRef,
    private _windowScrollService: WindowScrollService,
    private _commentsService: CommentsService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._commentsService.startLoadingMorePostComments(this.postId());
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this.post$ = toObservable(
      computed(() => this._postStateService.state().entry),
    );

    this._postStateService.load(this.postId());

    this.comments$ = this._commentsService.selectPostComments(this.postId());
    this._commentsService.startLoadingPostComments(this.postId());
  }
}
