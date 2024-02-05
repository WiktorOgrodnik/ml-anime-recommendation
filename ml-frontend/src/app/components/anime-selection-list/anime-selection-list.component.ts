import { Component } from '@angular/core';
import { AnimeComponent } from '../anime/anime.component';
import { AddAnimeButtonComponent } from '../add-anime-button/add-anime-button.component';
import { AnimeService } from '../../services/anime.service';
import { Observable, switchMap } from 'rxjs';
import { Anime } from '../../models/anime';
import { CommonModule, NgIf, NgForOf, NgFor } from '@angular/common';
import { AddAnimeDialogWrapperComponent } from '../add-anime-dialog-wrapper/add-anime-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-anime-selection-list',
  standalone: true,
  imports: [
    AnimeComponent,
    AddAnimeButtonComponent,
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
  needsRefresh$: Observable<void>;

  dialog: AddAnimeDialogWrapperComponent | null = null;

  constructor(private readonly animeService: AnimeService, public matDialog: MatDialog) {
    this.needsRefresh$ = this.animeService.needsRefresh$ as Observable<void>;

    this.animes$ = this.needsRefresh$.pipe(switchMap(() =>
      this.animeService.getAnimes().pipe(
        tap(() => {
          if (this.dialog) {
            this.dialog.formSubmitted();
            this.dialog = null;
          }
        })
      )));
  }

  addAnime() {
    this.dialog = this.matDialog.open(AddAnimeDialogWrapperComponent, {}).componentInstance;
    this.dialog.animeAdded.subscribe(result => this.animeService.addAnime(result).subscribe());
  }
}
