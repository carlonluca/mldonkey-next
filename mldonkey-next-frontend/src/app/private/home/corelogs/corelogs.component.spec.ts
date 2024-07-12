import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorelogsComponent } from './corelogs.component';

describe('CorelogsComponent', () => {
  let component: CorelogsComponent;
  let fixture: ComponentFixture<CorelogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorelogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorelogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
