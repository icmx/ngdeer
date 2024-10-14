import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { appLinks } from './app.config';

@Component({
  selector: 'ngd-root',
  standalone: true,
  imports: [
    // Angular Imports
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  links = appLinks;
}
