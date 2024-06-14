import { TestBed } from '@angular/core/testing';

import { SysinfoService } from './sysinfo.service';

describe('SysinfoService', () => {
  let service: SysinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
