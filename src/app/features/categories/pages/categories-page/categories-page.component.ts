import {
  ChangeDetectionStrategy,
  Component,
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

  isLoading = this._categoriesStateService.isLoading;

  error = this._categoriesStateService.error;

  categories = this._categoriesStateService.entries;

  ngOnInit(): void {
    this._categoriesStateService.load();
  }
}
