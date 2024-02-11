import { Component } from '@angular/core';
import { AnimeComponent } from '../anime/anime.component';
import { AddAnimeButtonComponent } from '../add-anime-button/add-anime-button.component';
import { ShowRecommendationsButtonComponent } from '../show-recommendations-button/show-recommendations-button.component';
import { AnimeService } from '../../services/anime.service';
import { Observable, switchMap } from 'rxjs';
import { Anime } from '../../models/anime';
import { CommonModule, NgIf, NgForOf, NgFor } from '@angular/common';
import { AddAnimeDialogWrapperComponent, AddGenreDialogWrapperComponent } from '../add-anime-dialog-wrapper/add-anime-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Genre } from '../../models/genre';
import { GenreComponent } from '../genre/genre.component';

@Component({
  selector: 'app-anime-selection-list',
  standalone: true,
  imports: [
    GenreComponent,
    AnimeComponent,
    AddAnimeButtonComponent,
    ShowRecommendationsButtonComponent,
    CommonModule,
    NgIf,
    NgForOf,
    NgFor,
  ],
  templateUrl: './anime-selection-list.component.html',
  styleUrl: './anime-selection-list.component.scss'
})
export class AnimeSelectionListComponent {

  animes$ : Observable<Anime[]>
  genres$ : Observable<Genre[]>
  needsRefresh$: Observable<void>;

  dialog: AddAnimeDialogWrapperComponent | null = null;
  genreDialog: AddGenreDialogWrapperComponent | null = null;

  addAnimeButtonLabel = "Add anime";
  addCategoryButtonLabel = "Add Genre";
  addTypeButtonLabel = "Add type";

  constructor(private readonly animeService: AnimeService, public matDialog: MatDialog) {
    this.needsRefresh$ = this.animeService.selectedNeedsRefresh$ as Observable<void>;

    this.animes$ = this.needsRefresh$.pipe(switchMap(() =>
      this.animeService.getAnimes("selected").pipe(
        tap(() => {
          if (this.dialog) {
            this.dialog.formSubmitted();
            this.dialog = null;
          }
        })
      )));

    this.genres$ = this.needsRefresh$.pipe(switchMap(() =>
      this.animeService.getGenres().pipe(
        tap(() => {
          if (this.genreDialog) {
            this.genreDialog.formSubmitted();
            this.genreDialog = null;
          }
        })
      )));
  }

  addAnime() {
    this.dialog = this.matDialog.open(AddAnimeDialogWrapperComponent, {}).componentInstance;
    this.dialog.animeAdded.subscribe(result => this.animeService.addAnime(result).subscribe());
  }

  deleteAnime(anime_id: number) {
    this.animeService.deleteAnime(anime_id).subscribe();
  }

  deleteGenre(anime_id: number) {
      this.animeService.deleteGenre(anime_id).subscribe();
    }
  addCategory() {
    this.genreDialog = this.matDialog.open(AddGenreDialogWrapperComponent, {}).componentInstance;
    this.genreDialog.genreAdded.subscribe(result => this.animeService.addGenre(result).subscribe());
  }

  addType() {
    alert("Add type clicked")
  }

  showRecommendations() {
    this.animeService.genRecommendations().subscribe();
  }
}
