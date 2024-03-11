import { TestBed } from '@angular/core/testing';

import { PaymentRecordService } from './payment-record.service';

describe('PaymentRecordService', () => {
  let service: PaymentRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
