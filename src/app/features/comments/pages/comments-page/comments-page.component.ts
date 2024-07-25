import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { combineLatest, exhaustMap, scan, tap } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { DeferredSubject } from '../../../../common/classes/deferred-subject.class';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { extractParam } from '../../../../common/mappers/extract-param.mapper';
import { WithLater } from '../../../../common/types/with-later-type';
import { CommentsBranchComponent } from '../../components/comments-branch/comments-branch.component';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'ngd-comments-page',
  standalone: true,
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    CommentsBranchComponent,
    LoadingStubComponent,
  ],
  templateUrl: './comments-page.component.html',
  styleUrl: './comments-page.component.scss',
})
export class CommentsPageComponent {
  private _postId$ = this._activatedRoute.params.pipe(
    extractParam<string>('postId'),
  );

  private _later$ = new DeferredSubject<WithLater>({});

  comments$ = combineLatest([this._postId$, this._later$]).pipe(
    exhaustMap(([postId, params]) =>
      this._dataService.loadComments(postId, params),
    ),
    tap((comments) => {
      const later = comments.at(-1)?.id;
      this._later$.prev({ later });
    }),
    scan((prev, next) => {
      return [...prev, ...next];
    }),
  );

  isLoading$ = this._uiService.isLoading$;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private _uiService: UiService,
  ) {}

  handleScroll() {
    if (this._later$.getValue()?.later) {
      this._later$.next();
    }
  }
}
