import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardButtonComponent } from '../../../../common/components/clipboard-button/clipboard-button.component';
import { TimestampDirective } from '../../../../common/directives/timestamp.directive';
import { Post } from '../../models/post.model';

@Component({
  selector: 'ngd-post-card',
  imports: [
    // Angular Imports
    RouterLink,

    // Internal Imports
    ClipboardButtonComponent,
    TimestampDirective,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent {
  @Input({ required: true })
  post!: Post;
}
