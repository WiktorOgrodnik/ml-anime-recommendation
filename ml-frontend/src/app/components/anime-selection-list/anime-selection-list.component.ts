import { Component } from '@angular/core';
import { AnimeComponent } from '../anime/anime.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnimeService } from '../../services/anime.service';
import { Observable } from 'rxjs';
import { Anime } from '../../models/anime';
import { CommonModule, NgIf, NgForOf, NgFor } from '@angular/common';

@Component({
  selector: 'app-anime-selection-list',
  standalone: true,
  imports:
  [
    AnimeComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgIf,
    NgForOf,
    NgFor,
  ],
  templateUrl: './anime-selection-list.component.html',
  styleUrl: './anime-selection-list.component.scss'
})
export class AnimeSelectionListComponent {

  animes$: Observable<Anime[]>;

  constructor(private readonly animeService: AnimeService) {
    this.animes$ = this.animeService.getAnimes();
  }

  addAnime() {
    console.log("Clicked")
  }

  updateItems() {
  }
}
