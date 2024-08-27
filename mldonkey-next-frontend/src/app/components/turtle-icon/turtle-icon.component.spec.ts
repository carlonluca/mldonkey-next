import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurtleIconComponent } from './turtle-icon.component';

describe('TurtleIconComponent', () => {
  let component: TurtleIconComponent;
  let fixture: ComponentFixture<TurtleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurtleIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurtleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
