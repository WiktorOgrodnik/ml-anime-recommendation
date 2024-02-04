import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeSelectionListComponent } from './anime-selection-list.component';

describe('AnimeSelectionListComponent', () => {
  let component: AnimeSelectionListComponent;
  let fixture: ComponentFixture<AnimeSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeSelectionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
