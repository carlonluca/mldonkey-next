import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowContentViewComponent } from './follow-content-view.component';

describe('FollowContentViewComponent', () => {
  let component: FollowContentViewComponent;
  let fixture: ComponentFixture<FollowContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowContentViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
