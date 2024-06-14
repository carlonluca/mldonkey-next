import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysinfoComponent } from './sysinfo.component';

describe('SysinfoComponent', () => {
  let component: SysinfoComponent;
  let fixture: ComponentFixture<SysinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
