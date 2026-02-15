import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Observable, tap } from 'rxjs';
import { CaptionComponent } from '../../../../common/components/caption/caption.component';
import { ControlComponent } from '../../../../common/components/control/control.component';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { FieldComponent } from '../../../../common/components/field/field.component';
import { ErrorStubComponent } from '../../../../common/components/error-stub/error-stub.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { WindowScrollService } from '../../../../common/services/window-scroll.service';
import { WithCategoryId } from '../../../../common/types/with-category-id.type';
import { WithText } from '../../../../common/types/with-text.type';
import { toParams } from '../../../../common/utils/to-params.util';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { SearchPostsStateService } from '../../services/search-posts-state.service';

@Component({
  imports: [
    // Angular Imports
    ReactiveFormsModule,

    // Internal Imports
    ButtonComponent,
    CaptionComponent,
    ControlComponent,
    FieldComponent,
    ErrorStubComponent,
    LoadingStubComponent,
    PostCardComponent,
  ],
  selector: 'ngd-search-posts-page',
  templateUrl: './search-posts-page.component.html',
  styleUrl: './search-posts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPostsPageComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  private _router = inject(Router);

  private _activatedRoute = inject(ActivatedRoute);

  private _windowScrollService = inject(WindowScrollService);

  private _categoriesStateService = inject(CategoriesStateService);

  private _searchPostsStateService = inject(SearchPostsStateService);

  formGroup = new FormGroup<{
    text: FormControl<string>;
    categoryId: FormControl<string>;
  }>({
    text: new FormControl('', { nonNullable: true }),
    categoryId: new FormControl('', { nonNullable: true }),
  });

  isLoading = computed(() => {
    return (
      this._categoriesStateService.isLoading() ||
      this._searchPostsStateService.isLoading()
    );
  });

  error = computed(() => {
    return (
      this._categoriesStateService.error() ||
      this._searchPostsStateService.error()
    );
  });

  categories = computed(() => {
    return [
      { id: '', text: 'Без категории' },
      ...this._categoriesStateService.entries(),
    ];
  });

  posts = computed(() => this._searchPostsStateService.entries());

  queryParams$: Observable<WithText & WithCategoryId> =
    this._activatedRoute.queryParams;

  formGroupValue$: Observable<WithText & WithCategoryId> =
    this.formGroup.valueChanges.pipe(debounceTime(300));

  ngOnInit(): void {
    this._setupScrollToBottom();
    this._setupFormGroupValue();
    this._setupQueryParams();

    this._categoriesStateService.load();
  }

  private _setupScrollToBottom(): void {
    this._windowScrollService.scrollToBottom$
      .pipe(
        tap(() => {
          this._searchPostsStateService.loadMore(this.formGroup.value);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _setupFormGroupValue(): void {
    this.formGroupValue$
      .pipe(
        tap((value) => {
          this._searchPostsStateService.reset();
          this._router.navigate([], { queryParams: toParams(value) });
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _setupQueryParams(): void {
    this.queryParams$
      .pipe(
        tap(({ text, categoryId }) => {
          this.formGroup.setValue(
            { text: text || '', categoryId: categoryId || '' },
            { emitEvent: false },
          );

          if (text || categoryId) {
            this._searchPostsStateService.load({ text, categoryId });
          } else {
            this._searchPostsStateService.reset();
          }
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
