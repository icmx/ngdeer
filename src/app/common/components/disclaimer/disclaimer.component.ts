import { Component, inject } from '@angular/core';
import { DialogRef } from '../../classes/dialog-ref.class';
import { ButtonComponent } from '../button/button.component';

@Component({
  imports: [
    // Internal Imports
    ButtonComponent,
  ],
  selector: 'ngd-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
})
export class DisclaimerComponent {
  private _dialogRef = inject(DialogRef);

  handleButtonClick(): void {
    this._dialogRef.close(null);
  }
}
