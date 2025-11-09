import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { CategoriesStateService } from '../../services/categories-state.service';

@Component({
  imports: [
    // Internal Imports
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

  categories = computed(() => this._categoriesStateService.entries());

  isLoading = computed(() => this._categoriesStateService.isLoading());

  ngOnInit(): void {
    this._categoriesStateService.load();
  }
}
