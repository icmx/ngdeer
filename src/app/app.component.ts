import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LatestPostsStateService } from './features/posts/services/latest-posts-state.service';
import { RandomPostsStateService } from './features/posts/services/random-posts-state.service';
import { CategoryPostsStateService } from './features/posts/services/category-posts-state.service';
import { SearchPostsStateService } from './features/posts/services/search-posts-state.service';
import { APP_LINKS } from './app.config';
import { DisclaimerService } from './common/services/disclaimer.service';

@Component({
  imports: [
    // Angular Imports
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  selector: 'ngd-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private _disclaimerService = inject(DisclaimerService);

  private _latestPostsStateService = inject(LatestPostsStateService);

  private _randomPostsStateService = inject(RandomPostsStateService);

  private _categoryPostsStateService = inject(CategoryPostsStateService);

  private _searchPostsStateService = inject(SearchPostsStateService);

  links = APP_LINKS;

  ngOnInit(): void {
    this._disclaimerService.disclaim();
  }

  handleHeaderLinkClick(): void {
    this._latestPostsStateService.drop();
    this._randomPostsStateService.drop();
    this._categoryPostsStateService.drop();
    this._searchPostsStateService.drop();
  }
}
