import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { ErrorStubComponent } from '../../../../common/components/error-stub/error-stub.component';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { CategoriesStateService } from '../../services/categories-state.service';

@Component({
  imports: [
    // Internal Imports
    ErrorStubComponent,
    LoadingStubComponent,
    CategoryCardComponent,
  ],
  selector: 'ngd-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  private _categoriesStateService = inject(CategoriesStateService);

  isLoading = computed(() => this._categoriesStateService.isLoading());

  error = computed(() => this._categoriesStateService.error());

  categories = computed(() => this._categoriesStateService.entries());

  ngOnInit(): void {
    this._categoriesStateService.load();
  }
}
