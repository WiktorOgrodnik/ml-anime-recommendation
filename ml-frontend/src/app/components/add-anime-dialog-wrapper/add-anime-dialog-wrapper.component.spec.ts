import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnimeDialogWrapperComponent } from './add-anime-dialog-wrapper.component';

describe('AddAnimeDialogWrapperComponent', () => {
  let component: AddAnimeDialogWrapperComponent;
  let fixture: ComponentFixture<AddAnimeDialogWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnimeDialogWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAnimeDialogWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
