import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRecommendationsButtonComponent } from './show-recommendations-button.component';

describe('ShowRecommendationsButtonComponent', () => {
  let component: ShowRecommendationsButtonComponent;
  let fixture: ComponentFixture<ShowRecommendationsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRecommendationsButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowRecommendationsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
