import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-recommendations-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './show-recommendations-button.component.html',
  styleUrl: './show-recommendations-button.component.scss'
})
export class ShowRecommendationsButtonComponent {
  @Output() showRecommendationsClicked = new EventEmitter<void>();

  constructor() {}

  showRecommendations() {
    this.showRecommendationsClicked.emit();
  }
}
