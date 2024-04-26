import { TestBed } from '@angular/core/testing';

import { UiServiceService } from './ui-service.service';

describe('UiServiceService', () => {
  let service: UiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
