import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeRecommendationsListComponent } from './anime-recommendations-list.component';

describe('AnimeRecommendationsListComponent', () => {
  let component: AnimeRecommendationsListComponent;
  let fixture: ComponentFixture<AnimeRecommendationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeRecommendationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeRecommendationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
