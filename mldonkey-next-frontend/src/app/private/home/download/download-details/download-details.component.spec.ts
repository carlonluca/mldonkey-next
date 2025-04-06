import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDetailsComponent } from './download-details.component';

describe('DownloadDetailsComponent', () => {
  let component: DownloadDetailsComponent;
  let fixture: ComponentFixture<DownloadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
