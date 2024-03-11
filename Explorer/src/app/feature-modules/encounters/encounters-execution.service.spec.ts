import { TestBed } from '@angular/core/testing';

import { EncountersExecutionService } from './encounters-execution.service';

describe('EncountersExecutionService', () => {
  let service: EncountersExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncountersExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
