import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAnimeFormComponent, AddGenreFormComponent } from '../add-anime-form/add-anime-form.component';

@Component({
  selector: 'app-add-anime-dialog-wrapper',
  standalone: true,
  imports: [
    AddAnimeFormComponent,
  ],
  templateUrl: './add-anime-dialog-wrapper.component.html',
  styleUrl: './add-anime-dialog-wrapper.component.scss'
})
export class AddAnimeDialogWrapperComponent {

  @Output() animeAdded = new EventEmitter<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<AddAnimeDialogWrapperComponent>
  ) {}

  addAnime(anime_id: number) {
    this.animeAdded.emit(anime_id);
  }

  formSubmitted() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-add-anime-dialog-wrapper',
  standalone: true,
  imports: [
    AddGenreFormComponent,
  ],
  templateUrl: './add-genre-dialog-wrapper.component.html',
  styleUrl: './add-anime-dialog-wrapper.component.scss'
})
export class AddGenreDialogWrapperComponent {
  @Output() genreAdded = new EventEmitter<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<AddGenreDialogWrapperComponent>
  ) {}

  addAnime(genre_id: number) {
    this.genreAdded.emit(genre_id);
  }

  formSubmitted() {
    this.dialogRef.close();
  }
}
