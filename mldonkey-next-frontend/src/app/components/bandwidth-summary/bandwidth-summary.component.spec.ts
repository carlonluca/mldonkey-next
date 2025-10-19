import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandwidthSummaryComponent } from './bandwidth-summary.component';

describe('BandwidthSummaryComponent', () => {
  let component: BandwidthSummaryComponent;
  let fixture: ComponentFixture<BandwidthSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandwidthSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandwidthSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
