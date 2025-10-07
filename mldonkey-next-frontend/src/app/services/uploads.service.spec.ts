import { TestBed } from '@angular/core/testing';

import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
