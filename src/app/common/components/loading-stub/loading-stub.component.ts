import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngd-loading-stub',
  standalone: true,
  imports: [],
  templateUrl: './loading-stub.component.html',
  styleUrl: './loading-stub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStubComponent {}
