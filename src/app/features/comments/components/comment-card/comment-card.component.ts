import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TimestampDirective } from '../../../../common/directives/timestamp.directive';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'ngd-comment-card',
  imports: [
    // Internal Imports
    TimestampDirective,
  ],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCardComponent {
  @Input({ required: true })
  comment!: Comment;
}
