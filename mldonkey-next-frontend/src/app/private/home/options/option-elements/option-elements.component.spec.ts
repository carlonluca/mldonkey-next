import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionElementsComponent } from './option-elements.component';

describe('OptionElementsComponent', () => {
  let component: OptionElementsComponent;
  let fixture: ComponentFixture<OptionElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionElementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
