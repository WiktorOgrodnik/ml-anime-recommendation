import { Component, Output, EventEmitter } from '@angular/core';
import { Observable, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnimeService } from '../../services/anime.service';
import { Anime } from '../../models/anime';
import { MatAutocompleteModule, MatOptgroup } from '@angular/material/autocomplete'
import { Item } from '../../models/item';
import { Genre } from '../../models/genre';

@Component({
  standalone: true,
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatProgressSpinner,
    CommonModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptgroup,
  ],
  templateUrl: './add-anime-form.component.html',
  styleUrl: './add-anime-form.component.scss'
})
export abstract class AddAnimeFormComponentGeneric<T extends Item> {

  filteredOptions$: Observable<T[]>

  @Output() animeAdded = new EventEmitter<number>();
  animeForm = new FormGroup({
    anime: new FormControl<string>("", {
      validators: [Validators.required],
      nonNullable: true,
    })
  })

  localTitle = '';
  isLoading = false;

  constructor(protected readonly animeService: AnimeService) {
    this.filteredOptions$ = this.animeForm.controls.anime.valueChanges
      .pipe(
        debounceTime(400),
        filter(val => val.length >= 3),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val)
        })
      )
  }

  displayFn(anime: T) {
    return anime.name;
  }

  abstract filter(val: string): Observable<T[]>;

  onFormSubmit(): void {
    if (!this.animeForm.valid) {
      return;
    }

    this.isLoading = true;
    const anime : T = this.animeForm.get('anime')?.value as unknown as T;

    if (anime.id == undefined) {
      return;
    }

    this.animeAdded.emit(Number(anime.id));
  }
}

@Component({
  selector: 'app-add-anime-form',
  standalone: true,
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatProgressSpinner,
    CommonModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptgroup,
  ],
  templateUrl: './add-anime-form.component.html',
  styleUrl: './add-anime-form.component.scss'
})
export class AddAnimeFormComponent extends AddAnimeFormComponentGeneric<Anime> {
  override filter(val: string): Observable<Anime[]> {
    return this.animeService.search(val);
  }
}

@Component({
  selector: 'app-add-genre-form',
  standalone: true,
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatProgressSpinner,
    CommonModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptgroup,
  ],
  templateUrl: './add-anime-form.component.html',
  styleUrl: './add-anime-form.component.scss'
})
export class AddGenreFormComponent extends AddAnimeFormComponentGeneric<Genre> {
  override filter(val: string): Observable<Genre[]> {
    return this.animeService.searchGenre(val);
  }
}

