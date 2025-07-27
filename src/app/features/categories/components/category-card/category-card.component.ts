import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';

@Component({
  imports: [
    // Angular Imports
    RouterLink,
  ],
  selector: 'ngd-category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  category = input.required<Category>();
}
