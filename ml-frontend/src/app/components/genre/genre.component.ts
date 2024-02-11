import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Genre } from '../../models/genre';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {
  @Input() genre!: Genre;
  @Input() delete_visible!: boolean;

  @Output() genreDeleteClicked = new EventEmitter<number>();

  deleteClicked() {
    this.genreDeleteClicked.emit(this.genre.id);
  }
}
