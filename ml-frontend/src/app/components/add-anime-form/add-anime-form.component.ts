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
export class AddAnimeFormComponent {

  filteredOptions$: Observable<Anime[]>

  @Output() animeAdded = new EventEmitter<number>();
  animeForm = new FormGroup({
    anime_name: new FormControl<Anime>('', {
      validators: [Validators.required],
      nonNullable: true,
    })
  })

  localTitle = '';
  isLoading = false;

  constructor(private readonly animeService: AnimeService) {

    this.filteredOptions$ = this.animeForm.controls.anime_name.valueChanges
      .pipe(
        debounceTime(400),
        filter(val => val != null && val.length > 3),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
      )
  }

  displayFn(anime: Anime) {
    return anime.name;
  }

  filter(val: string): Observable<Anime[]> {
    return this.animeService.search(val);
  }

  onFormSubmit(): void {

    if (!this.animeForm.valid) {
      return;
    }

    this.isLoading = true;
    const anime_id = this.animeForm.get('anime_name')?.value;

    this.animeAdded.emit(Number(anime_id));
  }
}
