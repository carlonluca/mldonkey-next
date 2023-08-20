import { TestBed } from '@angular/core/testing';

import { DownloadingFilesService } from './downloading-files.service';

describe('DownloadingFilesService', () => {
  let service: DownloadingFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadingFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
