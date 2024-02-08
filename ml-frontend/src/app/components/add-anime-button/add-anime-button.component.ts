import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-anime-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './add-anime-button.component.html',
  styleUrl: './add-anime-button.component.scss'
})
export class AddAnimeButtonComponent {

  @Input() label! : string;
  @Output() animeAddedClicked = new EventEmitter<void>();

  constructor () {}

  clicked() {
    this.animeAddedClicked.emit();
  }
}
