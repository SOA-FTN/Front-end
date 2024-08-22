import { TestBed } from '@angular/core/testing';

import { TourDataService } from './tour-data.service';

describe('TourDataService', () => {
  let service: TourDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
