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
  selector: 'ngd-categories-page',
  imports: [
    // Internal Imports
    LoadingStubComponent,
    CategoryCardComponent,
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  private _categoriesStateService = inject(CategoriesStateService);

  private _runCategoriesLoadSignal = computed(() => {
    const { loading, done } = this._categoriesStateService.state();

    return !done && !loading;
  });

  categoriesSignal = computed(
    () => this._categoriesStateService.state().entries,
  );

  loadingSignal = computed(() => this._categoriesStateService.state().loading);

  ngOnInit(): void {
    if (this._runCategoriesLoadSignal()) {
      this._categoriesStateService.load();
    }
  }
}
