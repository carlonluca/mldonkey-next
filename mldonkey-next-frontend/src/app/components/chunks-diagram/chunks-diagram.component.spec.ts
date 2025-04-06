import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunksDiagramComponent } from './chunks-diagram.component';

describe('ChunksDiagramComponent', () => {
  let component: ChunksDiagramComponent;
  let fixture: ComponentFixture<ChunksDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunksDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChunksDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
