import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimestampDirective } from '../../../../common/directives/timestamp.directive';
import { UserLabelComponent } from '../../../users/components/user-label/user-label.component';
import { Comment } from '../../models/comment.model';

@Component({
  imports: [
    // Internal Imports
    TimestampDirective,
    UserLabelComponent,
  ],
  selector: 'ngd-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCardComponent {
  comment = input.required<Comment>();
}
