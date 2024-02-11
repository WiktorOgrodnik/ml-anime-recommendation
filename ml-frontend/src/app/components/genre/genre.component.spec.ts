import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeComponent } from './anime.component';

describe('AnimeComponent', () => {
  let component: AnimeComponent;
  let fixture: ComponentFixture<AnimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
