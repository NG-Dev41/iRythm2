import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-loading-spinner',
    template: ''
  })
export class LoadingSpinnerComponentMock {
  @Input()
  loadingText: string;
}