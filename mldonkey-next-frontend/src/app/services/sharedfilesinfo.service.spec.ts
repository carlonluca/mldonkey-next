import { TestBed } from '@angular/core/testing';

import { SharedFilesinfoService } from './sharedfilesinfo.service';

describe('SharedfilesinfoService', () => {
  let service: SharedFilesinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFilesinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
