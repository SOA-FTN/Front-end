import { TestBed } from '@angular/core/testing';

import { ToursBachelorServiceService } from './tours-bachelor-service.service';

describe('ToursBachelorServiceService', () => {
  let service: ToursBachelorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToursBachelorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
