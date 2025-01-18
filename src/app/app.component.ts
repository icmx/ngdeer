import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ScrollService } from './common/services/scroll.service';
import { APP_LINKS } from './app.config';

@Component({
  selector: 'ngd-root',
  imports: [
    // Angular Imports
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    // External Imports
    InfiniteScrollDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  links = APP_LINKS;

  constructor(private _scrollService: ScrollService) {}

  handleScrolled() {
    this._scrollService.scroll();
  }
}
