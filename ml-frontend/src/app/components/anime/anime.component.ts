import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Anime } from '../../models/anime';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss'
})
export class AnimeComponent {
  @Input() anime!: Anime;
  @Input() delete_visible!: boolean;

  @Output() animeDeleteClicked = new EventEmitter<number>();

  deleteClicked() {
    this.animeDeleteClicked.emit(this.anime.id);
  }
}
