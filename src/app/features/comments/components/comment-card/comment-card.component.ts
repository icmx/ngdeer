import { Component, Input } from '@angular/core';
import { TimestampDirective } from '../../../../common/directives/timestamp.directive';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'ngd-comment-card',
  standalone: true,
  imports: [TimestampDirective],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent {
  @Input({ required: true })
  comment!: Comment;
}
