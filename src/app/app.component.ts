import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { appLinks } from './app.config';
import { ScrollService } from './common/services/scroll.service';

@Component({
  selector: 'ngd-root',
  standalone: true,
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
  links = appLinks;

  constructor(private _scrollService: ScrollService) {}

  handleScrolled() {
    this._scrollService.scroll();
  }
}
