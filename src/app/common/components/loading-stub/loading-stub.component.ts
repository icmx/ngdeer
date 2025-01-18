import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngd-loading-stub',
  imports: [],
  templateUrl: './loading-stub.component.html',
  styleUrl: './loading-stub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStubComponent {}
