import { TestBed } from '@angular/core/testing';

import { VisualGalleryService } from './visual-gallery.service';

describe('VisualGalleryService', () => {
  let service: VisualGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
