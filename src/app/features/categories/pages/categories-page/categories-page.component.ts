import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'ngd-categories-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CategoryCardComponent, LoadingStubComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
})
export class CategoriesPageComponent {
  categories$ = this._dataService.loadCategories();

  isLoading$ = this._uiService.isLoading$;

  constructor(
    private _dataService: DataService,
    private _uiService: UiService,
  ) {}
}
