import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadingStubComponent } from '../../../../common/components/loading-stub/loading-stub.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'ngd-categories-page',
  imports: [
    // Angular Imports
    AsyncPipe,

    // Internal Imports
    LoadingStubComponent,
    CategoryCardComponent,
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  categories$ = this._categoriesService.selectEntries();

  isLoading$ = this._categoriesService.selectLoading();

  constructor(private _categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this._categoriesService.startLoading();
  }
}
