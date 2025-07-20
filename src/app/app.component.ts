import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryPostsStateService } from './features/posts/services/category-posts-state.service';
import { SearchPostsStateService } from './features/posts/services/search-posts-state.service';
import { APP_LINKS } from './app.config';

@Component({
  selector: 'ngd-root',
  imports: [
    // Angular Imports
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private _categoryPostsStateService = inject(CategoryPostsStateService);

  private _searchPostsStateService = inject(SearchPostsStateService);

  links = APP_LINKS;

  handleHeaderLinkClick(): void {
    this._categoryPostsStateService.drop();
    this._searchPostsStateService.drop();
  }
}
