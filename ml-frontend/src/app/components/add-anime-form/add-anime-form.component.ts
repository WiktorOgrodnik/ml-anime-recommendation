import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-anime-form',
  standalone: true,
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './add-anime-form.component.html',
  styleUrl: './add-anime-form.component.scss'
})
export class AddAnimeFormComponent implements OnInit {

  $anime_id!: Observable<number>;

  @Output() animeAdded = new EventEmitter<number>();
  animeForm: FormGroup;

  localTitle = '';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.animeForm = this.fb.group({
      anime_id: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  onFormSubmit(): void {

    if (!this.animeForm.valid) {
      return;
    }

    this.isLoading = true;
    const anime_id = this.animeForm.get('anime_id')?.value;
    this.animeAdded.emit(anime_id);
  }
}
