import { Component, Input, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  combineLatest,
  exhaustMap,
  map,
  of,
  shareReplay,
  startWith,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { Comment } from '../../models/comment.model';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';
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
})
export class CommentsBranchComponent implements OnInit {
  @Input({ required: true })
  rootComment!: Comment;

  childComments$: Observable<Comment[]> = of([]);

  showLoadMoreButton$: Observable<boolean> = of(false);

  isLoading$: Observable<boolean> = of(false);

  private _loadMore$ = new Subject<void>();

  private _branchComments$: Observable<Comment[]> = of([]);

  constructor(
    private _dataService: DataService,
    private _uiService: UiService,
  ) {}

  ngOnInit(): void {
    this._branchComments$ = this._loadMore$.pipe(
      exhaustMap(() => this._dataService.loadBranch(this.rootComment.id)),
      shareReplay(1),
    );

    this.childComments$ = this._branchComments$.pipe(
      startWith(this.rootComment.branch || []),
    );

    const isBranchLoading$ = this._uiService.branchLoading$.pipe(
      map((rootCommentId) => this.rootComment.id === rootCommentId),
    );

    this.showLoadMoreButton$ = combineLatest([
      isBranchLoading$,
      this.childComments$,
    ]).pipe(
      map(([isBranchLoading, childComments]) => {
        if (isBranchLoading) {
          return false;
        }

        if (this.rootComment.branchSize === null) {
          return false;
        }

        if (this.rootComment.branchSize === 0) {
          return false;
        }

        if (this.rootComment.branchSize === 1) {
          return false;
        }

        if (this.rootComment.branchSize === childComments?.length) {
          return false;
        }

        return true;
      }),
    );

    this.isLoading$ = combineLatest([
      this.showLoadMoreButton$,
      isBranchLoading$,
    ]).pipe(
      map(
        ([showLoadMoreButton, isBranchLoading]) =>
          !showLoadMoreButton && isBranchLoading,
      ),
    );
  }

  handleLoadMoreButtonClick(): void {
    this._loadMore$.next();
  }
}
