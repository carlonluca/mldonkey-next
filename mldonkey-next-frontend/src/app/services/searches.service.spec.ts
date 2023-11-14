import { TestBed } from '@angular/core/testing';

import { SearchesService } from './searches.service';

describe('SearchesService', () => {
  let service: SearchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
