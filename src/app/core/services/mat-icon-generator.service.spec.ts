import { TestBed } from '@angular/core/testing';

import { MatIconGeneratorService } from './mat-icon-generator.service';

describe('MatIconGeneratorService', () => {
  let service: MatIconGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatIconGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
