import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  exhaustMap,
  filter,
  map,
  tap,
} from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { CaptionComponent } from '../../../../common/components/caption/caption.component';
import { ControlComponent } from '../../../../common/components/control/control.component';
import { FieldComponent } from '../../../../common/components/field/field.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { SuffixDirective } from '../../../../common/directives/suffix.directive';
import { extractScrollPosition } from '../../../../common/mappers/extract-scroll-position.mapper';
import { extractParams } from '../../../../common/mappers/extract-params.mapper';
import { ScrollPosition } from '../../../../common/types/scroll-position.type';
import { WithCategoryId } from '../../../../common/types/with-category-id.type';
import { WithFrom } from '../../../../common/types/with-from.type';
import { WithText } from '../../../../common/types/with-text.type';
import { DataService as CategoriesDataService } from '../../../categories/services/data.service';
import { UiService as CategoriesUiService } from '../../../categories/services/ui.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { DataService as PostsDataService } from '../../services/data.service';
import { UiService as PostsUiService } from '../../services/ui.service';

export type SearchPostsPageComponentFormGroupValue = {
  text: FormControl<string>;
  categoryId: FormControl<string>;
};

export class SearchPostsPageComponentFormGroup extends FormGroup<SearchPostsPageComponentFormGroupValue> {
  constructor() {
    super({
      text: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      categoryId: new FormControl('', { nonNullable: true }),
    });
  }
}

@Component({
  selector: 'ngd-search-posts-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    FieldComponent,
    CaptionComponent,
    ControlComponent,
    SuffixDirective,
    InfiniteScrollDirective,
    PostCardComponent,
    LoadingStubComponent,
    ButtonComponent,
  ],
  templateUrl: './search-posts-page.component.html',
  styleUrl: './search-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPostsPageComponent implements AfterViewChecked {
  formGroup = new SearchPostsPageComponentFormGroup();

  private _scrollPosition$ = this._router.events.pipe(extractScrollPosition());

  private _prevScrollPosition: ScrollPosition = null;

  private _queryParams$ =
    this._activatedRoute.queryParams.pipe(
      extractParams<WithText & WithCategoryId>(),
    );

  private _from$ = new BehaviorSubject<WithFrom>({});

  private _prevFrom: WithFrom = {};

  private _loadingParams$ = combineLatest([
    this._from$,
    this._queryParams$,
  ]).pipe(
    filter(
      ([, queryParams]) => !!queryParams.text && queryParams.text.length >= 3,
    ),
    map(([from, queryParams]) => ({ ...from, ...queryParams })),
  );

  isLoading$ = combineLatest([
    this._categoriesUiService.isLoading$,
    this._postsUiService.isLoading$,
  ]).pipe(
    map((isLoadings) => {
      return isLoadings.some((isLoading) => isLoading === true);
    }),
  );

  categories$ = this._categoriesDataService.loadCategories();

  posts$ = combineLatest([
    this._scrollPosition$,
    this._loadingParams$.pipe(
      exhaustMap((params) => this._postsDataService.loadSearchPosts(params)),
    ),
  ]).pipe(
    map(([scrollPosition, posts]) => {
      this._prevScrollPosition = scrollPosition;

      const from = posts.at(-1)?.id;
      this._prevFrom = { from };

      return posts;
    }),
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _viewportScroller: ViewportScroller,
    private _categoriesDataService: CategoriesDataService,
    private _categoriesUiService: CategoriesUiService,
    private _postsDataService: PostsDataService,
    private _postsUiService: PostsUiService,
  ) {
    this._queryParams$
      .pipe(takeUntilDestroyed())
      .subscribe(({ text, categoryId }) => {
        this.formGroup.controls.text.setValue(text || '', { emitEvent: false });

        this.formGroup.controls.categoryId.setValue(categoryId || '', {
          emitEvent: false,
        });
      });

    this.formGroup.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => {
          this._postsDataService.clear();
        }),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this._router.navigate([], {
          queryParams: { ...value },
        });
      });
  }

  ngAfterViewChecked(): void {
    if (this._prevScrollPosition) {
      this._viewportScroller.scrollToPosition(this._prevScrollPosition);
    }
  }

  handleScrolled(): void {
    this._from$.next(this._prevFrom);
  }

  handleTextFieldSuffixClick(): void {
    this.formGroup.controls.text.setValue('');
  }
}
