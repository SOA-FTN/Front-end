import { TestBed } from '@angular/core/testing';

import { BachelorEncounterServiceService } from './bachelor-encounter-service.service';

describe('BachelorEncounterServiceService', () => {
  let service: BachelorEncounterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BachelorEncounterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
