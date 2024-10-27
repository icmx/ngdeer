import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngd-not-found-page',
  standalone: true,
  imports: [],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
