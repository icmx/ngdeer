import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { appLinks } from './app.config';
import { DataService as PostsDataService } from './features/posts/services/data.service';

@Component({
  selector: 'ngd-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  links = appLinks;

  constructor(
    private _router: Router,
    private _postsDataService: PostsDataService,
  ) {
    this._router.events
      .pipe(
        filter((event) => {
          const isNavigationStart = event instanceof NavigationStart;

          if (!isNavigationStart) {
            return false;
          }

          const isEnteringPostComments = event.url.startsWith('/posts');
          const isGoingBackwards = event.navigationTrigger === 'popstate';

          return !isEnteringPostComments && !isGoingBackwards;
        }),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this._postsDataService.clear();
      });
  }
}
