import { Component, OnInit } from '@angular/core';
import { AnimeComponent } from '../anime/anime.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Observable } from 'rxjs';
import { Anime } from '../../models/anime'
import { AnimeService } from '../../services/anime.service';
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-anime-recommendations-list',
  standalone: true,
  imports: [
    AnimeComponent,
    MatProgressSpinner,
    CommonModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './anime-recommendations-list.component.html',
  styleUrl: './anime-recommendations-list.component.scss'
})
export class AnimeRecommendationsListComponent implements OnInit {

  animes$: Observable<Anime[]>;
  needsRefresh$: Observable<void>;

  ngOnInit(): void {

  }

  constructor(private readonly animeService: AnimeService) {
    this.needsRefresh$ = this.animeService.recommendedNeedsRefresh$ as Observable<void>;

    this.animes$ = this.needsRefresh$.pipe(switchMap(() =>
      this.animeService.getAnimes("recommended")
    ));
  }
}
