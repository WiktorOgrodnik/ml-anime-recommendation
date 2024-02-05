import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnimeButtonComponent } from './add-anime-button.component';

describe('AddAnimeButtonComponent', () => {
  let component: AddAnimeButtonComponent;
  let fixture: ComponentFixture<AddAnimeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnimeButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAnimeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
