import { TestBed } from '@angular/core/testing';

import { HeaderEcgGainControllerService } from './header-ecg-gain-controller.service';

describe('HeaderEcgGainControllerService', () => {
  let service: HeaderEcgGainControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderEcgGainControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
