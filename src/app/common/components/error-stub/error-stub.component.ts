import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'ngd-error-stub',
  templateUrl: './error-stub.component.html',
  styleUrl: './error-stub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStubComponent {}
