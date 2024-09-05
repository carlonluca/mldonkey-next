import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedIndicatorComponent } from './speed-indicator.component';

describe('SpeedIndicatorComponent', () => {
  let component: SpeedIndicatorComponent;
  let fixture: ComponentFixture<SpeedIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
