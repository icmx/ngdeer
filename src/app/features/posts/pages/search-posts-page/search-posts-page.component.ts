import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, debounceTime, map, Observable, tap } from 'rxjs';
import { CaptionComponent } from '../../../../common/components/caption/caption.component';
import { ControlComponent } from '../../../../common/components/control/control.component';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { FieldComponent } from '../../../../common/components/field/field.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { WithCategoryId } from '../../../../common/types/with-category-id.type';
import { WithText } from '../../../../common/types/with-text.type';
import { CategoriesService } from '../../../categories/services/categories.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { SearchPostsService } from '../../services/search-posts.service';

export class SearchPostsPageComponentFormGroup extends FormGroup<{
  text: FormControl<string>;
  categoryId: FormControl<string>;
}> {
  constructor() {
    super({
      text: new FormControl('', { nonNullable: true }),
      categoryId: new FormControl('', { nonNullable: true }),
    });
  }
}

@Component({
  selector: 'ngd-search-posts-page',
  imports: [
    // Angular Imports
    AsyncPipe,
    ReactiveFormsModule,

    // Internal Imports
    ButtonComponent,
    CaptionComponent,
    ControlComponent,
    FieldComponent,
    LoadingStubComponent,
    PostCardComponent,
  ],
  templateUrl: './search-posts-page.component.html',
  styleUrl: './search-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPostsPageComponent implements OnInit {
  formGroup = new SearchPostsPageComponentFormGroup();

  isLoading$ = combineLatest([
    this._categoriesService.selectLoading(),
    this._searchPostsService.selectLoading(),
  ]).pipe(
    map((loadings) => {
      return loadings.some((loading) => loading === true);
    }),
  );

  categories$ = this._categoriesService.selectEntries().pipe(
    map((entries) => {
      return [{ id: '', postsLink: '', text: 'Без категории' }, ...entries];
    }),
  );

  posts$ = this._searchPostsService.selectEntries();

  private _formGroupValue$ = this.formGroup.valueChanges.pipe(
    map((value) => {
      const entries = Object.entries(value).filter(
        ([, controlValue]) => !!controlValue,
      );

      return Object.fromEntries(entries) as WithText & WithCategoryId;
    }),
    debounceTime(300),
  );

  private _queryParams$: Observable<WithText & WithCategoryId> =
    this._activatedRoute.queryParams;

  constructor(
    private _destroyRef: DestroyRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _windowScrollService: WindowScrollService,
    private _categoriesService: CategoriesService,
    private _searchPostsService: SearchPostsService,
  ) {}

  ngOnInit(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._searchPostsService.startLoadingMore(this.formGroup.value);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._formGroupValue$
      .pipe(
        tap((value) => {
          const queryParams: Params = this.formGroup.valid ? { ...value } : {};

          this._router.navigate([], { queryParams });
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._queryParams$
      .pipe(
        tap(({ text = '', categoryId = '' }) => {
          this.formGroup.patchValue({ text, categoryId }, { emitEvent: false });

          if (text || categoryId) {
            this._searchPostsService.startLoading({ text, categoryId });
          } else {
            this._searchPostsService.drop();
          }
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();

    this._categoriesService.startLoading();
  }
}
