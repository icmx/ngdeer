import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';

@Component({
  selector: 'ngd-category-card',
  standalone: true,
  imports: [
    // Angular Imports
    RouterLink,
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  @Input({ required: true })
  category!: Category;
}
