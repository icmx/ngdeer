import { Component, Input } from '@angular/core';
import { TimestampDirective } from '../../../../common/directives/timestamp.directive';
import { Post } from '../../models/post.model';

@Component({
  selector: 'ngd-post-card',
  standalone: true,
  imports: [TimestampDirective],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input({ required: true })
  post!: Post;
}
