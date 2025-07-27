import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'ngd-loading-stub',
  templateUrl: './loading-stub.component.html',
  styleUrl: './loading-stub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStubComponent {}
